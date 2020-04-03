package org.openwis.metadataportal.services.user.dto;

public enum UserAction {
    CREATE,
    UPDATE,
    REMOVE,
    LOCK,
    UNLOCK,
    PASSWORD_CHANGE,
    PASSWORD_EXPIRE_NOTIFICATION_MAIL,
    INACTIVITY_NOTIFICATION_MAIL
}