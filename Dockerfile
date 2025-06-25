FROM python:3.12
WORKDIR /app
RUN pip install --upgrade pip
RUN pip install flask
RUN pip freeze > requirements.txt
ENV FLASK_APP=app
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "index.py"]