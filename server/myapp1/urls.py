from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework.viewsets import ViewSetMixin
import inflect
import re
from .utils import camel_to_kebab
from . import viewsets as vs_module
from . import views

router = DefaultRouter()

inflector = inflect.engine()

for attr_name in dir(vs_module):
    viewset = getattr(vs_module, attr_name)

    if isinstance(viewset, type) and issubclass(viewset, ViewSetMixin):
        base = re.sub(r"ViewSet$", "", attr_name)
        if base != "CustomModel":
            kebab = camel_to_kebab(base)
            route = inflector.plural(kebab)
            router.register(route, viewset, basename=route)


urlpatterns = [
    path("", include(router.urls)),
    path("signup", views.RegistrationAPI.as_view(), name="register"),
    path("cookie-logout", views.CookieLogoutView.as_view(), name="cookie-logout"),
    path("cookie-login", views.CookieLoginView.as_view(), name="cookie-login"),
    path("cookie-reauth", views.CookieReauthView.as_view(), name="cookie-reauth"),
    path("csrf/", views.csrf),
]
