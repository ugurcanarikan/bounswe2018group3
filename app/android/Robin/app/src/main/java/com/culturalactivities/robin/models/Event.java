package com.culturalactivities.robin.models;

import java.util.ArrayList;

public class Event {
    private int type = 0;
    private String id, eventName, eventInfo, artistInfo, date, time;
    private double price;
    private boolean isCreated = false;
    private float rating;
    private Location location;
    private ArrayList<Comment> comments = new ArrayList<>();
    private ArrayList<User> goingUser = new ArrayList<>();
    private ArrayList<Tag> tags= new ArrayList<>();
    private ArrayList<Image> images = new ArrayList<>();

    public Event() {
        eventName = "Event Title";
        images = new ArrayList<>();
    }
    public Event(boolean isCreated, int type, String id, String eventName) {
        this.type = type;
        this.isCreated = isCreated;
        this.id=id;
        this.eventName=eventName;
        this.artistInfo = "";
        this.date = "";
        this.time = "";
        this.price = 0;
        this.rating = 0;
        this.location = null;
        this.comments = new ArrayList<>();
        this.goingUser = new ArrayList<>();
        this.tags = new ArrayList<>();
        this.images = new ArrayList<>();
    }

    public Event(String eventName, String eventInfo, String artistInfo, String date, String time, double price, float rating, Location location, ArrayList<Comment> comments, ArrayList<User> goingUser, ArrayList<Tag> tags, ArrayList<Image> images) {
        this.eventName = eventName;
        this.eventInfo = eventInfo;
        this.artistInfo = artistInfo;
        this.date = date;
        type = 0;
        this.time = time;
        this.price = price;
        this.rating = rating;
        this.location = location;
        this.comments = comments;
        this.goingUser = goingUser;
        this.tags = tags;
        this.images = images;
    }

    public Event(String id, String eventName, String eventInfo, String artistInfo, String date, String time, double price, float rating, Location location, ArrayList<Comment> comments, ArrayList<User> goingUser, ArrayList<Tag> tags, ArrayList<Image> images) {
        this.id = id;
        type = 0;
        this.eventName = eventName;
        this.eventInfo = eventInfo;
        this.artistInfo = artistInfo;
        this.date = date;
        this.time = time;
        this.price = price;
        this.rating = rating;
        this.location = location;
        this.comments = comments;
        this.goingUser = goingUser;
        this.tags = tags;
        this.images = images;
    }

    public boolean isCreated() {
        return isCreated;
    }

    public void setCreated(boolean created) {
        isCreated = created;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public String getEventInfo() {
        return eventInfo;
    }

    public void setEventInfo(String eventInfo) {
        this.eventInfo = eventInfo;
    }

    public String getArtistInfo() {
        return artistInfo;
    }

    public void setArtistInfo(String artistInfo) {
        this.artistInfo = artistInfo;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public float getRating() {
        return rating;
    }

    public void setRating(float rating) {
        this.rating = rating;
    }

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public ArrayList<Comment> getComments() {
        return comments;
    }

    public void setComments(ArrayList<Comment> comments) {
        this.comments = comments;
    }

    public ArrayList<User> getGoingUser() {
        return goingUser;
    }

    public void setGoingUser(ArrayList<User> goingUser) {
        this.goingUser = goingUser;
    }

    public ArrayList<Tag> getTags() {
        return tags;
    }

    public void setTags(ArrayList<Tag> tags) {
        this.tags = tags;
    }

    public ArrayList<Image> getImages() {
        return images;
    }

    public void setImages(ArrayList<Image> images) {
        this.images = images;
    }
}
