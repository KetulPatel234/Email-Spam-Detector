from app import create_app

if __name__ == "__main__":
    app = create_app()
    app.run(host="localhost", port=5000, use_reloader=True) # Set use_reloader to True for development
