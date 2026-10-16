import os
import sys
import time
import math
import hashlib
import datetime
import warnings
import numpy as np

# Suppress benign serialization warnings for clean logs
warnings.filterwarnings("ignore")

import pefile
from flask import Flask, request, jsonify
from flask_cors import CORS

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.dirname(BASE_DIR)
TEST_DIR = os.path.join(BACKEND_DIR, "test")
UPLOADS_DIR = os.path.join(BASE_DIR, "uploads")
MODEL_PATH = os.path.join(BASE_DIR, "bagging_voting_ensemble.joblib")

os.makedirs(UPLOADS_DIR, exist_ok=True)

app = Flask(__name__)
CORS(app)

# Load ensemble model with robust fallback handling
model = None
try:
    import joblib
    if os.path.exists(MODEL_PATH):
        model = joblib.load(MODEL_PATH)
        print("✅ Bagging Voting Ensemble loaded successfully!")
    else:
        print(f"⚠️ Model file not found at {MODEL_PATH}")
except Exception as e:
    print(f"⚠️ Warning loading model: {e}")
    model = None

# MITRE ATT&CK Technique Mapping Catalog
MITRE_ATTACK_CATALOG = {
    "T1055": {
        "name": "Process Injection",
        "tactic": "Defense Evasion, Privilege Escalation",
        "description": "Injects code into processes to evade defenses and elevate privileges.",
        "apis": [
            "VirtualAlloc", "VirtualAllocEx", "WriteProcessMemory", "CreateRemoteThread",
            "QueueUserAPC", "SetThreadContext", "NtMapViewOfSection", "VirtualProtect",
            "VirtualProtectEx", "RtlMoveMemory"
        ]
    },
    "T1497": {
        "name": "Virtualization/Sandbox Evasion",
        "tactic": "Defense Evasion, Discovery",
        "description": "Detects debuggers or virtualization environments to alter execution.",
        "apis": [
            "IsDebuggerPresent", "CheckRemoteDebuggerPresent", "OutputDebugStringA",
            "FindWindowA", "Sleep"
        ]
    },
    "T1112": {
        "name": "Modify Registry",
        "tactic": "Defense Evasion, Persistence",
        "description": "Modifies Windows Registry keys to establish persistence or hide configuration.",
        "apis": [
            "RegCreateKeyExA", "RegSetValueExA", "RegOpenKeyExA", "RegDeleteValueA",
            "RegCreateKeyExW", "RegSetValueExW"
        ]
    },
    "T1071": {
        "name": "Application Layer Protocol (C2)",
        "tactic": "Command and Control",
        "description": "Communicates using standard network protocols to beacon or exfiltrate data.",
        "apis": [
            "InternetOpenA", "InternetConnectA", "URLDownloadToFileA", "WSAStartup",
            "connect", "send", "recv", "HttpSendRequestA", "InternetReadFile", "socket"
        ]
    },
    "T1059": {
        "name": "Command and Scripting Interpreter",
        "tactic": "Execution",
        "description": "Spawns command shells or execution processes to launch payloads.",
        "apis": [
            "WinExec", "ShellExecuteA", "ShellExecuteW", "CreateProcessA",
            "CreateProcessW", "CreateProcessAsUserA"
        ]
    },
    "T1082": {
        "name": "System Information Discovery",
        "tactic": "Discovery",
        "description": "Gathers machine timing, tick counts, and hardware profiles.",
        "apis": [
            "GetSystemTime", "QueryPerformanceCounter", "GetTickCount"
        ]
    },
    "T1078": {
        "name": "Token & Privilege Manipulation",
        "tactic": "Defense Evasion, Privilege Escalation",
        "description": "Manipulates access tokens to acquire SeDebugPrivilege or administrative rights.",
        "apis": [
            "AdjustTokenPrivileges", "OpenProcessToken", "LookupPrivilegeValueA"
        ]
    }
}

PACKED_SECTION_NAMES = {
    "UPX0", "UPX1", "UPX2", ".aspack", ".themida", ".vmp", ".mpress",
    ".nsp0", ".nsp1", ".nsp2", ".pack", ".petite", ".yoda"
}

def calculate_entropy(data):
    """Calculates Shannon entropy (0.0 to 8.0) of raw byte buffer."""
    if not data:
        return 0.0
    entropy = 0.0
    length = len(data)
    for x in range(256):
        p_x = float(data.count(bytes([x]))) / length
        if p_x > 0:
            entropy -= p_x * math.log2(p_x)
    return round(entropy, 3)

def compute_hashes(file_path):
    """Computes MD5, SHA-1, and SHA-256 for a given binary."""
    md5 = hashlib.md5()
    sha1 = hashlib.sha1()
    sha256 = hashlib.sha256()
    with open(file_path, "rb") as f:
        while chunk := f.read(65536):
            md5.update(chunk)
            sha1.update(chunk)
            sha256.update(chunk)
    return {
        "md5": md5.hexdigest(),
        "sha1": sha1.hexdigest(),
        "sha256": sha256.hexdigest()
    }

def format_bytes(size):
    """Formats raw byte count into human-readable string."""
    for unit in ['B', 'KB', 'MB', 'GB']:
        if size < 1024.0:
            return f"{size:.2f} {unit}"
        size /= 1024.0
    return f"{size:.2f} TB"

def generate_hex_dump(file_path, num_bytes=256):
    """Generates formatted hexadecimal and ASCII representation of binary head."""
    hex_dump = []
    try:
        with open(file_path, "rb") as f:
            raw_data = f.read(num_bytes)
        for i in range(0, len(raw_data), 16):
            chunk = raw_data[i:i+16]
            hex_part = " ".join(f"{b:02X}" for b in chunk)
            ascii_part = "".join(chr(b) if 32 <= b <= 126 else "." for b in chunk)
            hex_dump.append({
                "offset": f"{i:08X}",
                "hex": hex_part.ljust(48),
                "ascii": ascii_part
            })
    except Exception as e:
        print(f"Error creating hex dump: {e}")
    return hex_dump

def analyze_pe_file(file_path, original_filename="unknown.exe"):
    """
    Performs full static analysis on a PE file:
    - Hashes and file metadata
    - DOS and NT Header fields
    - Section entropy & packed indicators
    - Memory protections (W^X violations) & Authenticode digital signatures
    - MITRE ATT&CK TTP mapping
    - Ensemble model prediction with individual estimator breakdown
    - Composite threat score & explainable recommendations
    - Monospace Hex Dump representation
    """
    file_size = os.path.getsize(file_path)
    hashes = compute_hashes(file_path)
    hex_dump = generate_hex_dump(file_path, 256)

    try:
        pe = pefile.PE(file_path)
    except Exception as e:
        return {
            "error": f"Failed to parse PE binary: {str(e)}",
            "is_valid_pe": False,
            "filename": original_filename,
            "file_size": format_bytes(file_size),
            "hashes": hashes,
            "hex_dump": hex_dump
        }

    # Extract DOS header features used by ML model
    dos_header_fields = [
        "e_magic", "e_cblp", "e_cp", "e_crlc", "e_cparhdr",
        "e_minalloc", "e_maxalloc"
    ]
    raw_dos_features = [getattr(pe.DOS_HEADER, field, 0) for field in dos_header_fields]
    feature_vector = np.array(raw_dos_features[:7]).reshape(1, -1)

    # Compile timestamp
    compile_time = "Unknown"
    try:
        timestamp = pe.FILE_HEADER.TimeDateStamp
        compile_time = datetime.datetime.fromtimestamp(timestamp, datetime.timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
    except Exception:
        pass

    # Machine Architecture
    machine_arch = "x86 (32-bit)" if pe.FILE_HEADER.Machine == 0x14c else ("x64 (64-bit)" if pe.FILE_HEADER.Machine == 0x8664 else f"0x{pe.FILE_HEADER.Machine:x}")

    # Subsystem
    subsystem_map = {
        1: "Native",
        2: "Windows GUI",
        3: "Windows CUI (Console)",
        7: "POSIX CUI",
        9: "Windows CE GUI",
        10: "EFI Application"
    }
    subsystem = subsystem_map.get(pe.OPTIONAL_HEADER.Subsystem, f"Other ({pe.OPTIONAL_HEADER.Subsystem})")

    # Authenticode Digital Signature Check
    has_digital_signature = False
    if hasattr(pe, "OPTIONAL_HEADER") and len(pe.OPTIONAL_HEADER.DATA_DIRECTORY) > 4:
        sec_dir = pe.OPTIONAL_HEADER.DATA_DIRECTORY[4]
        has_digital_signature = bool(sec_dir.VirtualAddress > 0 and sec_dir.Size > 0)

    # Section Analysis, Shannon Entropy & Memory Protection (W^X Check)
    sections_report = []
    has_high_entropy = False
    has_packed_section = False
    has_rwx_sections = False
    rwx_section_names = []
    max_entropy = 0.0

    for section in pe.sections:
        sec_name = section.Name.decode(errors="ignore").strip("\x00") or "[empty]"
        entropy = calculate_entropy(section.get_data())
        if entropy > max_entropy:
            max_entropy = entropy

        is_entropy_high = entropy > 7.0
        if is_entropy_high:
            has_high_entropy = True

        is_packed = sec_name in PACKED_SECTION_NAMES
        if is_packed:
            has_packed_section = True

        # Check section memory permissions
        is_writable = bool(section.Characteristics & 0x80000000)
        is_executable = bool(section.Characteristics & 0x20000000)
        is_readable = bool(section.Characteristics & 0x40000000)

        perms = ("R" if is_readable else "-") + ("W" if is_writable else "-") + ("X" if is_executable else "-")
        is_rwx = is_writable and is_executable
        if is_rwx:
            has_rwx_sections = True
            rwx_section_names.append(sec_name)

        sections_report.append({
            "name": sec_name,
            "virtual_size": section.Misc_VirtualSize,
            "raw_size": section.SizeOfRawData,
            "entropy": entropy,
            "permissions": perms,
            "is_rwx": is_rwx,
            "is_high_entropy": is_entropy_high,
            "is_packed_name": is_packed
        })

    # Imports & MITRE ATT&CK API Mapping
    all_imports = []
    mitre_detected = {}
    suspicious_apis_flat = []

    if hasattr(pe, "DIRECTORY_ENTRY_IMPORT"):
        for entry in pe.DIRECTORY_ENTRY_IMPORT:
            dll_name = entry.dll.decode(errors="ignore") if entry.dll else "Unknown DLL"
            dll_funcs = []
            for imp in entry.imports:
                func_name = imp.name.decode(errors="ignore") if imp.name else (f"Ordinal_{imp.ordinal}" if imp.ordinal else None)
                if not func_name:
                    continue
                dll_funcs.append(func_name)

                # Match against MITRE ATT&CK Catalog
                for tech_id, tech_info in MITRE_ATTACK_CATALOG.items():
                    if func_name in tech_info["apis"]:
                        if tech_id not in mitre_detected:
                            mitre_detected[tech_id] = {
                                "id": tech_id,
                                "name": tech_info["name"],
                                "tactic": tech_info["tactic"],
                                "description": tech_info["description"],
                                "matched_apis": []
                            }
                        if func_name not in mitre_detected[tech_id]["matched_apis"]:
                            mitre_detected[tech_id]["matched_apis"].append(func_name)
                        if func_name not in suspicious_apis_flat:
                            suspicious_apis_flat.append(func_name)

            all_imports.append({
                "dll": dll_name,
                "function_count": len(dll_funcs),
                "sample_functions": dll_funcs[:6]
            })

    # Machine Learning Ensemble Inference
    ml_prediction = 1
    ensemble_votes = {}
    total_models = 0
    malicious_votes = 0

    if model is not None:
        try:
            with warnings.catch_warnings():
                warnings.simplefilter("ignore")
                ml_prediction = int(model.predict(feature_vector)[0])

                if hasattr(model, "named_estimators_"):
                    for name, est in model.named_estimators_.items():
                        pred = int(est.predict(feature_vector)[0])
                        ensemble_votes[name] = {
                            "verdict": "Malware" if pred == 1 else "Benign",
                            "vote": pred
                        }
                        total_models += 1
                        if pred == 1:
                            malicious_votes += 1
        except Exception as e:
            print(f"Inference error: {e}")
            ml_prediction = 1 if (has_high_entropy or len(suspicious_apis_flat) >= 3) else 0
    else:
        ml_prediction = 1 if (has_high_entropy or len(suspicious_apis_flat) >= 3) else 0

    consensus_percentage = round((malicious_votes / max(total_models, 1)) * 100, 1) if total_models > 0 else (100.0 if ml_prediction == 1 else 0.0)

    # Detect Dangerous Weaponized API Chains
    has_injection_chain = any(f in suspicious_apis_flat for f in ["VirtualAllocEx", "WriteProcessMemory", "CreateRemoteThread", "SetThreadContext"])
    has_dropper_chain = any(f in suspicious_apis_flat for f in ["URLDownloadToFileA", "InternetReadFile", "HttpSendRequestA"]) and any(f in suspicious_apis_flat for f in ["WinExec", "CreateProcessA", "CreateProcessW"])

    # Composite Threat Score (0 - 100) & Explainable AI Insights
    score = 0
    threat_insights = []
    anomalies = []

    # 1. Ensemble ML consensus impact (up to 30 pts)
    if total_models > 0:
        ml_points = (malicious_votes / total_models) * 30
        score += ml_points
        if malicious_votes >= 3:
            threat_insights.append(f"AI Ensemble Consensus: {malicious_votes} of {total_models} models flagged potential threat patterns ({consensus_percentage}% agreement).")
        else:
            threat_insights.append(f"AI Ensemble Consensus: Majority benign verdict ({total_models - malicious_votes}/{total_models} models clean).")
    else:
        if ml_prediction == 1:
            score += 20

    # 2. Entropy & Packer impact (up to 25 pts)
    if has_packed_section:
        score += 25
        threat_insights.append("Known malware packer section signature identified (e.g. UPX, Themida, ASPack).")
        anomalies.append("Binary packed with known obfuscation packer.")
    elif max_entropy > 7.2:
        score += 20
        threat_insights.append(f"Very high Shannon entropy detected ({max_entropy:.2f}/8.0), indicating encrypted payloads or packed shellcode.")
        anomalies.append(f"Elevated section entropy ({max_entropy:.2f}/8.0).")
    elif max_entropy > 6.8:
        score += 10
        threat_insights.append(f"Moderate section entropy ({max_entropy:.2f}/8.0) - consistent with dense code.")
    else:
        threat_insights.append(f"Normal section entropy ({max_entropy:.2f}/8.0) - consistent with standard compiled code.")

    # 3. Memory Protection Violation: W^X Check (up to 15 pts)
    if has_rwx_sections:
        score += 15
        threat_insights.append(f"SECURITY ANOMALY: W^X memory violation detected in section(s) {', '.join(rwx_section_names)} (Readable, Writable, and Executable).")
        anomalies.append(f"W^X Protection Violated: Section(s) {', '.join(rwx_section_names)} marked RWX (permits self-modifying code).")

    # 4. MITRE ATT&CK & Suspicious APIs (up to 25 pts)
    if has_injection_chain:
        score += 25
        threat_insights.append("CRITICAL: Detected Process Injection API chain (VirtualAllocEx / WriteProcessMemory / CreateRemoteThread) commonly weaponized for process hollowing.")
        anomalies.append("Process Hollowing API Chain detected.")
    elif has_dropper_chain:
        score += 20
        threat_insights.append("HIGH: Detected Dropper/Downloader API pattern (Network Retrieval + Process Execution).")
        anomalies.append("Dropper / Second-Stage Loader API Chain detected.")
    elif len(suspicious_apis_flat) >= 4:
        score += 12
        threat_insights.append(f"Multiple dual-use system APIs detected ({len(suspicious_apis_flat)} functions) across {len(mitre_detected)} MITRE ATT&CK techniques.")
    elif len(suspicious_apis_flat) > 0:
        score += 6
        threat_insights.append(f"Standard system management APIs detected ({len(suspicious_apis_flat)} functions) - typical in administrative utilities and setup installers.")
    else:
        threat_insights.append("Clean import table: No suspicious injection, evasion, or persistence APIs found.")

    # 5. Authenticode Signature Status (up to 5 pts)
    if not has_digital_signature:
        score += 5
        anomalies.append("Unsigned Binary: Lacks cryptographic Authenticode digital signature table.")
    else:
        threat_insights.append("Authenticode: Binary contains a valid security certificate directory.")

    # Normalize final score
    threat_score = min(max(int(score), 0), 100)

    # Final Classification Verdict
    if threat_score >= 65:
        verdict = "MALICIOUS / HIGH RISK"
        threat_level = "CRITICAL"
        is_malware = True
    elif threat_score >= 40:
        verdict = "SUSPICIOUS"
        threat_level = "ELEVATED"
        is_malware = True
    else:
        verdict = "CLEAN / BENIGN"
        threat_level = "LOW"
        is_malware = False

    return {
        "is_valid_pe": True,
        "filename": original_filename,
        "file_size": format_bytes(file_size),
        "file_size_bytes": file_size,
        "hashes": hashes,
        "hex_dump": hex_dump,
        "metadata": {
            "compile_time": compile_time,
            "machine_arch": machine_arch,
            "subsystem": subsystem,
            "number_of_sections": len(sections_report),
            "entry_point": f"0x{pe.OPTIONAL_HEADER.AddressOfEntryPoint:08X}",
            "image_base": f"0x{pe.OPTIONAL_HEADER.ImageBase:08X}",
            "max_entropy": max_entropy,
            "has_digital_signature": has_digital_signature,
            "has_rwx_sections": has_rwx_sections
        },
        "security_profile": {
            "digital_signature": "Signed" if has_digital_signature else "Unsigned",
            "memory_protection_wx": "Violated (RWX present)" if has_rwx_sections else "Enforced (W^X compliant)",
            "anomalies": anomalies
        },
        "dos_header": {field: raw_dos_features[i] for i, field in enumerate(dos_header_fields)},
        "sections": sections_report,
        "imports": all_imports[:12],
        "mitre_attack": list(mitre_detected.values()),
        "total_suspicious_apis": len(suspicious_apis_flat),
        "ml_analysis": {
            "prediction": 1 if is_malware else 0,
            "consensus_percentage": consensus_percentage,
            "estimators": ensemble_votes,
            "ensemble_architecture": "Bagging + Hard Voting (Decision Tree, Random Forest, XGBoost, LightGBM)"
        },
        "verdict": verdict,
        "threat_level": threat_level,
        "threat_score": threat_score,
        "threat_insights": threat_insights
    }

# Pre-loaded sample catalog for recruiter demonstration
SAMPLE_CATALOG = [
    {
        "id": "wildfire-test",
        "name": "WildFire PE Threat Simulation",
        "filename": "wildfire-test-pe-file.exe",
        "description": "Standard Palo Alto Networks WildFire PE test binary containing packed sections, RWX memory permissions, and registry manipulation calls.",
        "expected_type": "Threat Simulation"
    },
    {
        "id": "7zip-installer",
        "name": "7-Zip Official Setup Utility",
        "filename": "7z2409.exe",
        "description": "Authentic official 7-Zip installation package for Windows systems with clean W^X enforcement.",
        "expected_type": "Benign Utility"
    },
    {
        "id": "greenshot-installer",
        "name": "Greenshot Open Source Utility",
        "filename": "Greenshot-INSTALLER-1.2.10.6-RELEASE.exe",
        "description": "Legitimate open-source screenshot utility for Windows with Authenticode digital signature.",
        "expected_type": "Benign Application"
    },
    {
        "id": "win-diagnostic",
        "name": "Windows System Diagnostic Binary",
        "filename": "win.exe",
        "description": "Native Windows execution binary used for system diagnostics.",
        "expected_type": "System Tool"
    }
]

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint indicating model state and version."""
    return jsonify({
        "status": "online",
        "service": "Sentinel Wraith Malware Detection Engine",
        "version": "2.2.0",
        "model_loaded": model is not None,
        "active_models": [
            "DecisionTreeClassifier (Bagging)",
            "RandomForestClassifier (Bagging)",
            "XGBClassifier (Bagging)",
            "LGBMClassifier (Bagging)"
        ]
    })

@app.route('/samples', methods=['GET'])
def get_samples():
    """Returns list of curated PE binaries available for 1-click recruiter testing."""
    return jsonify({
        "samples": SAMPLE_CATALOG
    })

@app.route('/analyze-sample', methods=['POST'])
def analyze_sample():
    """Analyzes a pre-loaded sample binary by ID without requiring a local file upload."""
    data = request.get_json() or {}
    sample_id = data.get("sample_id")

    sample_meta = next((s for s in SAMPLE_CATALOG if s["id"] == sample_id), None)
    if not sample_meta:
        return jsonify({"error": f"Sample ID '{sample_id}' not found in catalog."}), 404

    sample_path = os.path.join(TEST_DIR, sample_meta["filename"])
    if not os.path.exists(sample_path):
        return jsonify({"error": f"Sample binary file '{sample_meta['filename']}' not found on server."}), 404

    report = analyze_pe_file(sample_path, sample_meta["filename"])
    report["is_sample"] = True
    report["sample_info"] = sample_meta
    return jsonify(report)

@app.route('/compare', methods=['POST'])
def compare():
    """Compares two sample binaries side-by-side for forensic benchmark diffing."""
    data = request.get_json() or {}
    sample_id_a = data.get("sample_a", "7zip-installer")
    sample_id_b = data.get("sample_b", "wildfire-test")

    sample_meta_a = next((s for s in SAMPLE_CATALOG if s["id"] == sample_id_a), None)
    sample_meta_b = next((s for s in SAMPLE_CATALOG if s["id"] == sample_id_b), None)

    if not sample_meta_a or not sample_meta_b:
        return jsonify({"error": "Invalid sample selection for comparison."}), 400

    report_a = analyze_pe_file(os.path.join(TEST_DIR, sample_meta_a["filename"]), sample_meta_a["filename"])
    report_b = analyze_pe_file(os.path.join(TEST_DIR, sample_meta_b["filename"]), sample_meta_b["filename"])

    return jsonify({
        "sample_a": {
            "info": sample_meta_a,
            "report": report_a
        },
        "sample_b": {
            "info": sample_meta_b,
            "report": report_b
        }
    })

@app.route('/predict', methods=['POST'])
@app.route('/analyze', methods=['POST'])
def predict():
    """Upload endpoint for user-provided PE (.exe) files or JSON sample triggers."""
    # Check if request has JSON payload with sample_id
    if request.is_json:
        data = request.get_json() or {}
        sample_id = data.get("sample_id")
        if sample_id:
            sample_meta = next((s for s in SAMPLE_CATALOG if s["id"] == sample_id), None)
            if sample_meta:
                sample_path = os.path.join(TEST_DIR, sample_meta["filename"])
                if os.path.exists(sample_path):
                    report = analyze_pe_file(sample_path, sample_meta["filename"])
                    report["is_sample"] = True
                    report["sample_info"] = sample_meta
                    return jsonify(report)

    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded in multipart/form-data under key 'file'"}), 400

    file = request.files['file']
    if not file.filename:
        return jsonify({"error": "Selected file has an empty filename"}), 400

    filename = file.filename
    temp_path = os.path.join(UPLOADS_DIR, f"{int(time.time())}_{filename}")
    
    try:
        file.save(temp_path)
        report = analyze_pe_file(temp_path, filename)
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

    return jsonify(report)

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    print(f"🚀 Sentinel Wraith AI Engine listening on http://localhost:{port}")
    app.run(host="0.0.0.0", port=port, debug=False)
