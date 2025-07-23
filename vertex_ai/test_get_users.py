import requests
resp = requests.get("http://localhost:5000/get_users")
print(resp.json())
