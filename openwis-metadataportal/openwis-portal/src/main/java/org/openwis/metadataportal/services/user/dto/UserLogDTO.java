package org.openwis.metadataportal.services.user.dto;

import org.codehaus.jackson.annotate.JsonIgnore;
import org.codehaus.jackson.annotate.JsonProperty;

import java.sql.Timestamp;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.FormatStyle;

public class UserLogDTO {

    private int id;

    private Timestamp date;

    private UserActions action;

    private String username;

    private String attribute;

    private String actioner;

    /**
     * Type of action
     */
    public UserActions getAction() {
        return action;
    }

    public void setAction(UserActions action) {
        this.action = action;
    }

    /**
     * name of the user who received the action
     */
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    /**
     * LDAP Attribute name
     */
    public String getAttribute() {
        return attribute;
    }

    public void setAttribute(String attribute) {
        this.attribute = attribute;
    }

    /**
     * Name of user who performed the action
     */
    public String getActioner() {
        return actioner;
    }

    public void setActioner(String actioner) {
        this.actioner = actioner;
    }

    @JsonIgnore
    public Timestamp getDate() {
        return date;
    }

    @JsonProperty("date")
    public String getDateAsString() {
        ZoneId zoneId = ZoneId.systemDefault();
        ZonedDateTime zdt = ZonedDateTime.ofInstant(this.date.toInstant(), zoneId);
        return zdt.format(DateTimeFormatter.ofLocalizedDateTime(FormatStyle.FULL));
    }

    public void setDate(Timestamp date) {
        this.date = date;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }
}