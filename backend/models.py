import numpy as np
import xgboost as xgb
import lightgbm as lgb
import catboost as cb
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, roc_auc_score
from sklearn.model_selection import KFold

class AdvancedStackedEnsemble:
    def __init__(self, n_folds=5):
        self.n_folds = n_folds

        # Base models with regularization
        self.base_models = {
            'xgb': xgb.XGBClassifier(
                n_estimators=100,
                learning_rate=0.1,
                max_depth=4,
                min_child_weight=5,
                reg_alpha=0.5,
                reg_lambda=1.0,
                random_state=42,
                eval_metric='logloss'
            ),
            'lgb': lgb.LGBMClassifier(
                n_estimators=100,
                learning_rate=0.1,
                max_depth=4,
                reg_alpha=0.5,
                reg_lambda=1.0,
                random_state=42
            ),
            'catboost': cb.CatBoostClassifier(
                iterations=100,
                learning_rate=0.1,
                depth=4,
                random_state=42,
                verbose=False
            ),
            'xgb_dart': xgb.XGBClassifier(
                booster='dart',
                n_estimators=100,
                learning_rate=0.1,
                max_depth=4,
                min_child_weight=5,
                reg_alpha=0.5,
                reg_lambda=1.0,
                random_state=42,
                eval_metric='logloss'
            )
        }

        # Meta-model
        self.meta_model = lgb.LGBMClassifier(
            n_estimators=100,
            learning_rate=0.05,
            max_depth=4,
            random_state=42
        )

        self.base_predictions = {}
        self.feature_importance = {}

    def _get_oof_predictions(self, model, X, y):
        """Get out-of-fold predictions for a single model"""
        oof_predictions = np.zeros(len(X))
        kf = KFold(n_splits=self.n_folds, shuffle=True, random_state=42)

        for fold, (train_idx, val_idx) in enumerate(kf.split(X)):
            X_train_fold, X_val_fold = X[train_idx], X[val_idx]
            y_train_fold, y_val_fold = y[train_idx], y[val_idx]

            if isinstance(model, xgb.XGBClassifier):
                try:
                    model.fit(
                        X_train_fold, y_train_fold,
                        eval_set=[(X_val_fold, y_val_fold)],
                        early_stopping_rounds=50,
                        verbose=False
                    )
                except TypeError:
                    best_iteration = None
                    best_score = float('inf')
                    for i in range(200):
                        model.fit(X_train_fold, y_train_fold)
                        preds = model.predict_proba(X_val_fold)[:, 1]
                        score = roc_auc_score(y_val_fold, preds)
                        if score < best_score:
                            best_score = score
                            best_iteration = i
                        else:
                            break
            elif isinstance(model, cb.CatBoostClassifier):
                model.fit(
                    X_train_fold, y_train_fold,
                    eval_set=(X_val_fold, y_val_fold),
                    early_stopping_rounds=50,
                    verbose=False
                )
            else:
                model.fit(X_train_fold, y_train_fold)

            oof_predictions[val_idx] = model.predict_proba(X_val_fold)[:, 1]

        return oof_predictions

    def train_base_models(self, X_train, y_train):
        X_train_array = X_train.to_numpy() if isinstance(X_train, pd.DataFrame) else X_train
        meta_features = np.zeros((X_train_array.shape[0], len(self.base_models)))

        for idx, (name, model) in enumerate(self.base_models.items()):
            print(f"\nTraining {name}...")
            meta_features[:, idx] = self._get_oof_predictions(model, X_train_array, y_train)
            self.base_predictions[name] = meta_features[:, idx]

            if isinstance(model, xgb.XGBClassifier):
                try:
                    model.fit(
                        X_train_array, y_train,
                        eval_set=[(X_train_array, y_train)],
                        early_stopping_rounds=50,
                        verbose=False
                    )
                except TypeError:
                    best_iteration = None
                    best_score = float('inf')
                    for i in range(200):
                        model.fit(X_train_array, y_train)
                        preds = model.predict_proba(X_train_array)[:, 1]
                        score = roc_auc_score(y_train, preds)
                        if score < best_score:
                            best_score = score
                            best_iteration = i
                        else:
                            break
            elif isinstance(model, cb.CatBoostClassifier):
                model.fit(
                    X_train_array, y_train,
                    eval_set=(X_train_array, y_train),
                    early_stopping_rounds=50,
                    verbose=False
                )
            else:
                model.fit(X_train_array, y_train)

            if hasattr(model, 'feature_importances_'):
                self.feature_importance[name] = model.feature_importances_

        return meta_features

    def train_meta_model(self, meta_features, y_train):
        print("\nTraining meta-model...")
        self.meta_model.fit(meta_features, y_train)

    def predict(self, X):
        X_array = X.to_numpy() if isinstance(X, pd.DataFrame) else X
        meta_features = np.zeros((X_array.shape[0], len(self.base_models)))

        for idx, (name, model) in enumerate(self.base_models.items()):
            meta_features[:, idx] = model.predict_proba(X_array)[:, 1]

        return self.meta_model.predict(meta_features)

    def predict_proba(self, X):
        X_array = X.to_numpy() if isinstance(X, pd.DataFrame) else X
        meta_features = np.zeros((X_array.shape[0], len(self.base_models)))
        base_probas = {}

        for name, model in self.base_models.items():
            proba = model.predict_proba(X_array)[:, 1]
            base_probas[name] = proba
            meta_features[:, list(self.base_models.keys()).index(name)] = proba

        final_probas = self.meta_model.predict_proba(meta_features)
        return final_probas, base_probas