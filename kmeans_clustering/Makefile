# Define your virtual environment and flask app
VENV = venv
FLASK_APP = app.py

# Install dependencies by creating a virtual environment and installing from requirements.txt
install:
	python3 -m venv $(VENV)
	. $(VENV)/bin/activate && pip install --upgrade pip
	. $(VENV)/bin/activate && pip install -r requirements.txt

# Run the Flask application
run:
	. $(VENV)/bin/activate && FLASK_APP=$(FLASK_APP) FLASK_ENV=development flask run --port 3000

# Clean up the virtual environment
clean:
	rm -rf $(VENV)

# Reinstall the environment and dependencies
reinstall: clean install

.PHONY: install run clean reinstall