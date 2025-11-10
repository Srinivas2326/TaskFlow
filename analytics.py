from flask import Flask, jsonify
import sqlite3

app = Flask(__name__)

@app.route('/analyze')
def analyze():
    conn = sqlite3.connect('../database/taskflow.db')
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM tasks")
    total_tasks = cursor.fetchone()[0]
    conn.close()

    return jsonify({"message": f"Total tasks in system: {total_tasks}"})

if __name__ == '__main__':
    app.run(port=5001)
