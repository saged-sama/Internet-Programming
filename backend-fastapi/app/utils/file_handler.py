import os
from uuid import uuid4

BaseFilePath = "app/static/files/"

def save_file(file):
    try:
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
    
    except OSError as e:
        print(f"Error creating directory or writing file: {e}")
        return None, None, None
    except AttributeError as e:
        print(f"Error accessing file attributes: {e}")
        return None, None, None
    except Exception as e:
        print(f"Unexpected error saving file: {e}")
        return None, None, None

def delete_file(filepath):
    try:
        os.remove(filepath)
        return True
    except FileNotFoundError:
        print(f"File not found: {filepath}")
        return False
    except PermissionError:
        print(f"Permission denied deleting file: {filepath}")
        return False
    except OSError as e:
        print(f"OS error deleting file {filepath}: {e}")
        return False
    except Exception as e:
        print(f"Unexpected error deleting file {filepath}: {e}")
        return False