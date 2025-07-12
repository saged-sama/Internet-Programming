import os
from uuid import uuid4

BaseFilePath = "app/static/files/"

def save_file(file):
    # Create directory if it doesn't exist
    os.makedirs(BaseFilePath, exist_ok=True)
    
    filename = uuid4().hex + "_" + file.filename.replace(" ", "_")
    filepath = BaseFilePath + filename
    file_type = file.content_type
    
    # Read file content once
    file_content = file.file.read()
    file_size = len(file_content)
    
    with open(filepath, "wb") as f:
        f.write(file_content)
    
    return filename, file_type, file_size

def delete_file(filepath):
    import os
    try:
        os.remove(filepath)
        return True
    except Exception as e:
        print(f"Error deleting file {filepath}: {e}")
        return False