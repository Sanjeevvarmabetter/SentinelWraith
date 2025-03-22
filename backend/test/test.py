import lief

try:
    binary = lief.parse("wildfire-test-pe-file.exe")
    print(binary)
except Exception as e:
    print("Error:", e)

