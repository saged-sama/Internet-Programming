import sys
import os

# Ensure `app/` is in sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from sqlmodel import SQLModel

from alembic import context

# ⬇️ Import all models to register metadata
from app.models.user import *
from app.models.program import *
from app.models.course import *
from app.models.assignment import *
from app.models.class_schedule import *
from app.models.equipment import *
from app.models.event import *
from app.models.exam import *
from app.models.fee import *
from app.models.grades import *
from app.models.meeting import *
from app.models.project import *
from app.models.research import *
from app.models.room import *
from app.models.all_models import *

from app.utils.config import settings

# Set Alembic config database URL dynamically
config = context.config
config.set_main_option("sqlalchemy.url", settings.database_url)

# Logging
if config.config_file_name:
    fileConfig(config.config_file_name)

target_metadata = SQLModel.metadata
