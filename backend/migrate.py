"""
Database Migration: Add created_at and email columns to expenses table
This script adds the missing columns required by the new features.
"""

from sqlalchemy import text
from database import engine

def run_migration():
    """Add missing columns to expenses table"""
    with engine.connect() as connection:
        try:
            # Add created_at column with default
            print("Adding created_at column...")
            connection.execute(text("""
                ALTER TABLE expenses 
                ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            """))
            print("✓ created_at column added")
        except Exception as e:
            print(f"⚠ created_at column: {str(e)}")
        
        try:
            # Add email column
            print("Adding email column...")
            connection.execute(text("""
                ALTER TABLE expenses 
                ADD COLUMN email VARCHAR
            """))
            print("✓ email column added")
        except Exception as e:
            print(f"⚠ email column: {str(e)}")
        
        try:
            # Create index on email for faster queries
            print("Creating index on email column...")
            connection.execute(text("""
                CREATE INDEX IF NOT EXISTS idx_expenses_email 
                ON expenses(email)
            """))
            print("✓ email index created")
        except Exception as e:
            print(f"⚠ email index: {str(e)}")
        
        # Commit the changes
        connection.commit()
        print("\n✅ Migration completed successfully!")

if __name__ == "__main__":
    run_migration()
