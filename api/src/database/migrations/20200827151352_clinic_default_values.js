exports.up = async (db) => {
  await db.raw(`
    ALTER TABLE clientest.clinic 
    CHANGE COLUMN clinic_type_id clinic_type_id INT NULL DEFAULT NULL ,
    CHANGE COLUMN address address VARCHAR(255) NULL DEFAULT NULL ,
    CHANGE COLUMN region_id region_id INT NULL DEFAULT NULL ,
    CHANGE COLUMN city_id city_id INT NULL DEFAULT NULL ,
    CHANGE COLUMN type_id type_id INT NULL DEFAULT NULL ,
    CHANGE COLUMN profile profile VARCHAR(255) NULL DEFAULT NULL ,
    CHANGE COLUMN info info TEXT NULL DEFAULT NULL ,
    CHANGE COLUMN cdate cdate DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ,
    CHANGE COLUMN new_product_ver new_product_ver VARCHAR(20) NULL DEFAULT NULL ,
    CHANGE COLUMN cur_product_ver cur_product_ver VARCHAR(20) NULL DEFAULT NULL ,
    CHANGE COLUMN update_time_start update_time_start TIME NULL DEFAULT NULL ,
    CHANGE COLUMN update_time_end update_time_end TIME NULL DEFAULT NULL ,
    CHANGE COLUMN force_update force_update INT NULL DEFAULT NULL ,
    CHANGE COLUMN update_message update_message TEXT NULL DEFAULT NULL ,
    CHANGE COLUMN install_product_time install_product_time DATETIME NULL DEFAULT NULL ,
    CHANGE COLUMN cladr cladr VARCHAR(36) NULL DEFAULT NULL ,
    CHANGE COLUMN logo logo VARCHAR(255) NULL DEFAULT NULL ,
    CHANGE COLUMN map map VARCHAR(100) NULL DEFAULT NULL ,
    CHANGE COLUMN is_phone_required is_phone_required TINYINT NOT NULL DEFAULT 0 ,
    CHANGE COLUMN is_anonym_visit is_anonym_visit TINYINT NOT NULL DEFAULT 0 ,
    CHANGE COLUMN is_home_request is_home_request TINYINT NOT NULL DEFAULT 0 ,
    CHANGE COLUMN clinic_type clinic_type TINYINT NULL DEFAULT NULL ;
    `);
};

exports.down = async () => {
  throw new Error("Not implemented");
};

exports.configuration = { transaction: true };
