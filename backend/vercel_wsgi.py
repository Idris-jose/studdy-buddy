from vercel_wsgi import make_wsgi_handler
from server import app

handler = make_wsgi_handler(app)
 