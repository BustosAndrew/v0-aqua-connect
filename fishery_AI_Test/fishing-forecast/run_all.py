# Convenience script: generate synthetic data, then train model
import subprocess, sys
subprocess.check_call([sys.executable, "src/data_gen.py"])
subprocess.check_call([sys.executable, "src/train.py"])
print("\nDone. Launch the app with:  streamlit run app/App.py\n")
