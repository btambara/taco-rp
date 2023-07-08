FROM python:3.10

ENV PYTHONPATH "${PYTHONPATH}:/api/app"

WORKDIR /api

COPY api/setup/requirements.txt /api/setup/requirements.txt
COPY api/alembic.ini /api/alembic.ini

RUN pip install --no-cache-dir --upgrade -r /api/setup/requirements.txt

COPY api/app /api/app

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "80"]
