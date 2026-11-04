from unittest.mock import patch

from django.db import OperationalError
from django.test import TestCase


class HealthTests(TestCase):
    def test_health_checks_database(self):
        response = self.client.get("/api/health/")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "ok", "database": "ok"})


class UnavailableHealthTests(TestCase):
    def test_database_failure_returns_service_unavailable(self):
        with patch("config.views.connection.cursor", side_effect=OperationalError):
            response = self.client.get("/api/health/")
        self.assertEqual(response.status_code, 503)
        self.assertEqual(response.json()["database"], "unavailable")
