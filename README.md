# NSCC Hackathon '26: Team Syntax Error Geeks


## Backend

### Setup

Requirements:

- Python 3.13+

#### 1. Create a Python virtual environment

```bash
cd backend
python -m venv .venv
```

#### 2. Activate the virtual environment

Linux, MacOS

```bash
source .venv/bin/activate
```

Windows PowerShell

```bash
.venv\Scripts\Activate.ps1
```

#### 3. Upgrade `pip`

```bash
python -m pip install --upgrade pip
```

#### 4. Install project dependencies

```bash
pip install -r requirements.txt
```

### Run Server

> Note: Make sure you are in the `backup` directory before running any commands.
> ```bash
> cd backup
> ```

#### 1. Activate the Python virtual environment

If you closed your terminal or are coming back another day, you will need to reactivate the virtual environment. **Follow step 2 of the setup section** to activate the virtual environment again.

#### 2. Start the backend server

```bash
python main.py
```

You can now access the backend server locally at http://127.0.0.1:8000/

FastAPI includes two API documentation tools and they can be accessed at http://127.0.0.1:8000/docs/ and http://127.0.0.1:8000/redocs/. Use which ever one you like best.
