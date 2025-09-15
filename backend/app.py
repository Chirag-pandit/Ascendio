import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
from werkzeug.utils import secure_filename
import smtplib
from email.message import EmailMessage

# Load environment variables
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"))

SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
SMTP_USER = os.getenv("SMTP_USER")
SMTP_PASS = os.getenv("SMTP_PASS")
FROM_EMAIL = os.getenv("FROM_EMAIL", SMTP_USER)
TO_EMAIL = os.getenv("TO_EMAIL", SMTP_USER)
FRONTEND_ORIGIN = os.getenv("FRONTEND_ORIGIN", "*")
PORT = int(os.getenv("PORT", 5000))

# Flask app
app = Flask(__name__, static_folder="../dist", static_url_path="/")

# CORS for frontend
if FRONTEND_ORIGIN == "*" or FRONTEND_ORIGIN == "":
    CORS(app)
else:
    CORS(app, origins=[FRONTEND_ORIGIN])


# ✅ Utility to send email with attachment
def send_job_application_email(data, resume_file=None):
    msg = EmailMessage()
    msg["From"] = FROM_EMAIL
    msg["To"] = TO_EMAIL
    msg["Subject"] = f"Job Application: {data.get('jobRole')} - {data.get('fullName')}"

    # Email body
    body = "\n".join([f"{k}: {v}" for k, v in data.items() if v and k != "resume"])
    msg.set_content(body)

    # Attach resume if provided
    if resume_file:
        filename = secure_filename(resume_file.filename)
        msg.add_attachment(
            resume_file.read(),
            maintype="application",
            subtype="octet-stream",
            filename=filename,
        )

    # Send email via Gmail SMTP
    with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as smtp:
        smtp.starttls()
        smtp.login(SMTP_USER, SMTP_PASS)
        smtp.send_message(msg)


# ✅ Job Application API
@app.route("/api/send-application", methods=["POST"])
def send_application():
    try:
        # Form fields
        full_name = request.form.get("fullName")
        email = request.form.get("email")
        phone = request.form.get("phone")
        course = request.form.get("course")
        year = request.form.get("year")
        experience = request.form.get("experience")
        job_role = request.form.get("jobRole")
        why_join = request.form.get("whyJoin")
        skills = request.form.get("skills")

        resume_file = request.files.get("resume")

        data = {
            "fullName": full_name,
            "email": email,
            "phone": phone,
            "course": course,
            "year": year,
            "experience": experience,
            "jobRole": job_role,
            "whyJoin": why_join,
            "skills": skills,
        }

        # Send mail
        send_job_application_email(data, resume_file)

        return jsonify({"success": True})
    except Exception as e:
        app.logger.exception("Job application failed")
        return jsonify({"success": False, "error": str(e)}), 500


# Health check
@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"ok": True})


# Serve React build in production
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_frontend(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    return send_from_directory(app.static_folder, "index.html")


if __name__ == "__main__":
    app.run(debug=True, port=PORT)
