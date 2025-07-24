from flask import Flask, jsonify
import subprocess
import json

app = Flask(__name__)

@app.route("/get_users")
def get_users():
    result = subprocess.run(
        ["node", "../mcp-client/mcp-client.js"],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    if result.returncode == 0:
        output = result.stdout.decode('utf-8')
        try:
            users = json.loads(output)
        except Exception:
            users = output
        return jsonify({"users": users})
    else:
        return jsonify({"error": result.stderr.decode('utf-8')}), 500

if __name__ == "__main__":
    app.run(port=5000)
