CREATE UNIQUE INDEX practice_collection_user_default_name
  ON practice_collection (user_id, name)
  WHERE is_default = true;
