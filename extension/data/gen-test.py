import os
import sys
import glob
import shutil
import subprocess

# Gecko Browser Test template
test_template = """
/* global add_heuristic_tests */

"use strict";

add_heuristic_tests(
  [
    {
      fixturePath: {{fileName}},
      expectedResult:
{{expected}}
    },
  ],
  {{filePath}}
);
"""

if len(sys.argv) != 2:
    print("Usage: python script.py <destination_directory>")
    sys.exit(1)

destination_dir = sys.argv[1]
script_dir = os.path.dirname(os.path.abspath(__file__))
json_file_dir = os.path.join(script_dir, "test")
json_files = glob.glob(os.path.join(json_file_dir, "*.json"))
if len(json_files) != 1:
    print(f"Error: Expected exactly one JSON file in {json_file_dir}, found {len(json_files)}")
    sys.exit(1)

json_path = json_files[0]
hostname = os.path.splitext(os.path.basename(json_path))[0]

output_file = f"browser_{hostname}.js"

output_path = os.path.join(script_dir, output_file)

# Run addtest before moving tests
try:
    mach_command = [
        "./mach",
        "addtest",
        f"browser/extensions/formautofill/test/browser/heuristics/third_party/{os.path.basename(output_file)}"
    ]
    subprocess.run(mach_command, cwd=destination_dir, check=True)
    print(f"Successfully executed: {' '.join(mach_command)}")
except subprocess.CalledProcessError as e:
    print(f"Error executing mach addtest: {e}")
    sys.exit(1)

# Create the test file based on the expected result
with open(json_path, 'r') as file:
    json_content = ''.join([f"      {line}" for line in file])

result = test_template.replace("{{expected}}", json_content)
result = result.replace("{{fileName}}", f"\"{hostname}.html\"")
result = result.replace("{{filePath}}", f"\"fixtures/third_party/{hostname}/\"")

try:
    with open(output_path, 'w') as file:
        file.write(result)
    print(f"Output written to {output_path}")
except IOError as e:
    print(f"Error writing to file: {e}")
    sys.exit(1)


# Move the test file
test_destination_dir = os.path.join(
    destination_dir,
    "browser/extensions/formautofill/test/browser/heuristics/third_party"
)

destination_path = os.path.join(test_destination_dir, os.path.basename(output_file))
try:
    shutil.copy2(output_path, destination_path)
    print(f"Output moved to {destination_path}")
except IOError as e:
    print(f"Error moving file: {e}")
    sys.exit(1)


# Move Downlaodeed Web Content to fixture_dir
fixture_dir = os.path.join(
    destination_dir,
    "browser/extensions/formautofill/test/fixtures/third_party",
    hostname
)

page_dir = os.path.join(script_dir, "page")
if os.path.exists(page_dir):
    print(f"Make directory  {fixture_dir}")
    os.makedirs(fixture_dir, exist_ok=True)

    for file_name in os.listdir(page_dir):
        print(f"Page directory has {file_name}")
        file_path = os.path.join(page_dir, file_name)
        target_path = os.path.join(fixture_dir, file_name)
        try:
            if os.path.isdir(file_path):
                print(f"Copy directory {file_name} to {fixture_dir}")
                shutil.copytree(file_path, target_path, dirs_exist_ok=True) 
            elif os.path.isfile(file_path):
                print(f"Copy file {file_path} to {target_path}")
                shutil.copy2(file_path, target_path)
        except IOError as e:
            print(f"Error copying {file_path}: {e}")
else:
    print(f"Page directory {page_dir} does not exist. Skipping file moves.")
