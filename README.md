### How do I get set up? ###

* **Checkout**:
	* 1) git clone https://github.com/schstp/things.git ;
	* 2) git checkout master .
* **Push**:
	* 1) git add * ;
	* 2) git commit -m "MESSAGE" ;
	* 3) git push .
* **Pull**:
	* 1) git pull .
* **Create virtual environment**:
	* 1) install python3 ;
	* 2) install virtualenvwrapper (https://virtualenvwrapper.readthedocs.org/en/latest/);
	* 3) create new virtualenv: mkvirtualenv mindmap .
	* 4) activate virtualenv: workon mindmap .
* **Dependencies**: pip install -r requirements.txt .
* **Run migrations**: python manage.py migrate mindmap .
* **How to run**: python manage.py runserver .

### How do I set up the PyCharm? ###
* **Download [Community Edition](https://www.jetbrains.com/pycharm/download/)**.
* **Configure the project**:
      * 1) click **Open Directory** in Welcome to PyCharm window;
      * 2) go to **Run/Edit Configurations** (Alt+u+r) and click green plus sing and choose Python;
      * 3) in name section enter *Run Server* and in script: *manage.py* , Script parameters: *runserver* , Working Directory: *current one*, *Python Interpretator*: {VIRTUALENVPATH}/things.
*  **Run Server** (Alt+Shift+F10 and select Run Server).
