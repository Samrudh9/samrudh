from flask import Flask, render_template

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html", active_page="home")


@app.route("/about")
def about():
    return render_template("about.html", active_page="about")


@app.route("/skills")
def skills():
    return render_template("skills.html", active_page="skills")


@app.route("/projects")
def projects():
    return render_template("projects.html", active_page="projects")


@app.route("/contact")
def contact():
    return render_template("contact.html", active_page="contact")


if __name__ == "__main__":
    app.run(debug=True)
