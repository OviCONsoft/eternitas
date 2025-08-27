FROM python:3.13.0

WORKDIR /backend

COPY ./backend/requirements.txt /requirements.txt

RUN pip install --no-cache-dir --upgrade -r /requirements.txt

COPY ./backend /backend

CMD ["uvicorn","app:app","--host","0.0.0.0","--proxy-headers", "--port", "80"]