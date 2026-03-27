import React, { useState, useEffect } from 'react';
import '../styles/TaskTracker.css';

// Real Data from Revolt Bikes Tracker - Complete Dataset
const SAMPLE_DATA = [
    { agent: "Aman", status: "Created", customer: "9518301903", source: "Paid", subsource: "Paid - Meta Form - TestRide", hub: "REVOLT HUB LATUR", booking: "RV26C186994", date: "2026-03-02", profession: "", model: "" },
    { agent: "Bharti", status: "Delivered", customer: "9565680684", source: "Organic", subsource: "Organic - Website-TestRide", hub: "REVOLT HUB UNNAO", booking: "RV26C187000", date: "2026-03-02", profession: "", model: "" },
    { agent: "Geeta", status: "Cancel", customer: "8570011499", source: "Organic", subsource: "Organic - Website-TestRide", hub: "REVOLT HUB MAHENDRAGARH", booking: "RV26C187022", date: "2026-03-02", profession: "", model: "" },
    { agent: "Gagan", status: "Delivered", customer: "9021795111", source: "Organic", subsource: "Organic - Website-Booking", hub: "REVOLT HUB NANDED", booking: "RV26C187029", date: "2026-03-02", profession: "", model: "" },
    { agent: "Bharti", status: "Delivered", customer: "8329796827", source: "Organic", subsource: "Referral Lead", hub: "REVOLT HUB SHIRWAL", booking: "RV26C187039", date: "2026-03-02", profession: "", model: "" },
    { agent: "Sushmita", status: "Created", customer: "9220525722", source: "Organic", subsource: "Organic - Website-Booking", hub: "REVOLT HUB BEHRAMPUR", booking: "RV26C187044", date: "2026-03-02", profession: "", model: "" },
    { agent: "Geeta", status: "Delivered", customer: "8439526337", source: "Organic", subsource: "Revolt Enquiry", hub: "REVOLT HUB DEHRADUN", booking: "RV26C187057", date: "2026-03-03", profession: "", model: "" },
    { agent: "Geeta", status: "Cancel", customer: "9119313101", source: "Organic", subsource: "Organic - Website-TestRide", hub: "REVOLT HUB BEGUSARAI", booking: "RV26C187062", date: "2026-03-03", profession: "", model: "" },
    { agent: "Bharti", status: "Created", customer: "7620577724", source: "Organic", subsource: "Revolt Enquiry", hub: "REVOLT HUB SOLAPUR", booking: "RV26C187073", date: "2026-03-03", profession: "", model: "" },
    { agent: "Gagan", status: "Created", customer: "9258671138", source: "Organic", subsource: "Organic - Website-TestRide", hub: "REVOLT HUB SHAHJAHANPUR", booking: "RV26C187090", date: "2026-03-03", profession: "", model: "" },
    { agent: "Gagan", status: "Created", customer: "8726525860", source: "Organic", subsource: "Organic - Website-Booking", hub: "REVOLT HUB CHHIBRAMAU", booking: "RV26C187125", date: "2026-03-05", profession: "", model: "" },
    { agent: "Aman", status: "Cancel", customer: "8684924412", source: "Organic", subsource: "Organic - Website-TestRide", hub: "REVOLT HUB NAJAFGARH", booking: "RV26C187135", date: "2026-03-05", profession: "", model: "" },
    { agent: "Aman", status: "Created", customer: "9887875306", source: "Paid", subsource: "Paid - Meta Form - TestRide", hub: "REVOLT HUB SIKAR", booking: "RV26C187148", date: "2026-03-05", profession: "", model: "" },
    { agent: "Gagan", status: "Cancel", customer: "9058006579", source: "Organic", subsource: "Organic - Website-TestRide", hub: "REVOLT HUB AONLA", booking: "RV26C187158", date: "2026-03-05", profession: "", model: "" },
    { agent: "Bharti", status: "Created", customer: "9772465503", source: "Paid", subsource: "Paid - Meta Form - TestRide", hub: "REVOLT HUB JODHPUR", booking: "RV26C187163", date: "2026-03-05", profession: "", model: "" },
    { agent: "Sushmita", status: "Created", customer: "7464054570", source: "Organic", subsource: "Organic - Website-TestRide", hub: "REVOLT HUB BEGUSARAI", booking: "RV26C187164", date: "2026-03-05", profession: "", model: "" },
    { agent: "Tannu keshar", status: "Created", customer: "9198522378", source: "Organic", subsource: "Organic - Website-TestRide", hub: "REVOLT HUB NASHIK", booking: "RV26C187168", date: "2026-03-05", profession: "", model: "" },
    { agent: "Gagan", status: "Created", customer: "8896937770", source: "Chatbot", subsource: "Chatbot", hub: "REVOLT HUB CHHIBRAMAU", booking: "RV26C187181", date: "2026-03-05", profession: "", model: "" },
    { agent: "Aman", status: "Created", customer: "9486632560", source: "Organic", subsource: "EV India", hub: "REVOLT HUB KARAIKAL", booking: "RV26C187192", date: "2026-03-06", profession: "", model: "" },
    { agent: "Gagan", status: "Created", customer: "7248160978", source: "Organic", subsource: "Organic - Website-TestRide", hub: "REVOLT HUB BURARI", booking: "RV26C187216", date: "2026-03-06", profession: "", model: "" },
    { agent: "Aman", status: "Created", customer: "8591703074", source: "Paid", subsource: "Paid - Google - Website-Booking", hub: "REVOLT HUB VIKHROLI", booking: "RV26C187218", date: "2026-03-06", profession: "", model: "" },
    { agent: "Gagan", status: "Created", customer: "7083021113", source: "Organic", subsource: "Revolt Enquiry", hub: "REVOLT HUB NASHIK", booking: "RV26C187234", date: "2026-03-06", profession: "", model: "" },
    { agent: "Tannu", status: "Created", customer: "9569204944", source: "Organic", subsource: "Organic - Website-TestRide", hub: "REVOLT HUB ANDHERI", booking: "RV26C187251", date: "2026-03-06", profession: "", model: "" },
    { agent: "Bharti", status: "Created", customer: "9850014275", source: "Paid", subsource: "Paid - Meta Form - TestRide", hub: "REVOLT HUB SOLAPUR", booking: "RV26C187253", date: "2026-03-06", profession: "", model: "" },
    { agent: "Aman", status: "Created", customer: "9561536755", source: "#N/A", subsource: "#N/A", hub: "#N/A", booking: "RV26C187276", date: "2026-03-07", profession: "", model: "" },
    { agent: "Gagan", status: "Created", customer: "7709031512", source: "Paid", subsource: "Paid - Meta Form - TestRide", hub: "REVOLT HUB SATARA", booking: "RV26C187305", date: "2026-03-07", profession: "", model: "" },
    { agent: "Geeta", status: "Delivered", customer: "8318283040", source: "Paid", subsource: "Paid - Revolt_fb - Website-Booking", hub: "REVOLT HUB BALLIA", booking: "RV26C187326", date: "2026-03-07", profession: "", model: "" },
    { agent: "Gagan", status: "Created", customer: "9311002191", source: "Paid", subsource: "Paid - Meta Form - TestRide", hub: "REVOLT HUB BEHROR", booking: "RV26C187349", date: "2026-03-09", profession: "", model: "" },
    { agent: "Bharti", status: "Created", customer: "8077809188", source: "Paid", subsource: "Paid - Meta Form - TestRide", hub: "REVOLT HUB ETAWAH", booking: "RV26C187354", date: "2026-03-09", profession: "", model: "" },
    { agent: "Geeta", status: "Delivered", customer: "8058370433", source: "#N/A", subsource: "#N/A", hub: "#N/A", booking: "RV26C187390", date: "2026-03-09", profession: "", model: "" },
    { agent: "Aman", status: "Delivered", customer: "9983462191", source: "Organic", subsource: "Organic - Website-Booking", hub: "REVOLT HUB BEHROR", booking: "RV26C187391", date: "2026-03-09", profession: "", model: "" },
    { agent: "Aman", status: "Created", customer: "9934903121", source: "Organic", subsource: "Revolt Enquiry", hub: "REVOLT HUB GAYA", booking: "RV26C187420", date: "2026-03-10", profession: "business", model: "RV1+" },
    { agent: "Tannu", status: "Created", customer: "9708748996", source: "Paid", subsource: "Paid - Meta Form - TestRide", hub: "REVOLT HUB SIWAN", booking: "RV26C187443", date: "2026-03-10", profession: "delivery boy", model: "RV BLAZEX" },
    { agent: "Aman", status: "Cancel", customer: "7014141814", source: "Organic", subsource: "Organic - Website-Booking", hub: "REVOLT HUB JODHPUR", booking: "RV26C187460", date: "2026-03-10", profession: "delivery boy", model: "RV1+" },
    { agent: "Tannu", status: "Created", customer: "9881990588", source: "Organic", subsource: "Organic - Website-TestRide", hub: "REVOLT HUB AURANGABAD", booking: "RV26C187499", date: "2026-03-10", profession: "farmer", model: "RV Blezex" },
    { agent: "Bharti", status: "Created", customer: "9657771174", source: "Paid", subsource: "Paid - Meta Form - TestRide", hub: "REVOLT HUB SOLAPUR", booking: "RV26C187517", date: "2026-03-10", profession: "Business", model: "RV1+" },
    { agent: "Sushmita", status: "Created", customer: "9935022707", source: "Organic", subsource: "Organic - Website-Booking", hub: "REVOLT HUB SHAHJAHANPUR", booking: "RV26C187528", date: "2026-03-11", profession: "", model: "" },
    { agent: "Sushmita", status: "Created", customer: "7807956842", source: "Organic", subsource: "Organic - Website-Booking", hub: "REVOLT HUB CHANDIGARH", booking: "RV26C187537", date: "2026-03-11", profession: "industrial area", model: "RV400" },
    { agent: "Bharti", status: "Delivered", customer: "9955158000", source: "Organic", subsource: "EV India", hub: "REVOLT HUB BETTIAH", booking: "RV26C187539", date: "2026-03-11", profession: "", model: "RV Blezex" },
    { agent: "Geeta", status: "Created", customer: "9926511805", source: "Paid", subsource: "Paid - Meta - Website-Booking", hub: "REVOLT HUB SIDHI", booking: "RV26C187542", date: "2026-03-11", profession: "Banking job", model: "RV Blezex" },
    { agent: "Geeta", status: "Cancellation Request", customer: "9527658976", source: "Paid", subsource: "Paid - Meta Form - TestRide", hub: "REVOLT HUB SOLAPUR", booking: "RV26C187548", date: "2026-03-11", profession: "Pvt Job", model: "RV1+" },
    { agent: "Geeta", status: "Created", customer: "9939880332", source: "Organic", subsource: "Revolt Enquiry", hub: "REVOLT HUB ARARIA", booking: "RV26C187594", date: "2026-03-11", profession: "Pvt Job", model: "" },
    { agent: "Gagan", status: "Created", customer: "9959271819", source: "Organic", subsource: "Organic - Website-Booking", hub: "REVOLT HUB MEDCHAL MALKAJGIRI", booking: "RV26C187554", date: "2026-03-12", profession: "", model: "" },
    { agent: "Gagan", status: "Created", customer: "8960166918", source: "Organic", subsource: "Organic - Website-TestRide", hub: "REVOLT HUB AZAMGARH", booking: "RV26C187625", date: "2026-03-12", profession: "IT Job", model: "RV400" },
    { agent: "Tannu", status: "Delivered", customer: "8217279954", source: "Paid", subsource: "Paid - Meta Form - TestRide", hub: "REVOLT HUB CHIKODI", booking: "RV26C187658", date: "2026-03-12", profession: "", model: "" },
    { agent: "Tannu", status: "Created", customer: "9537202403", source: "Chatbot", subsource: "Chatbot", hub: "REVOLT HUB KACHCHH", booking: "RV26C187680", date: "2026-03-12", profession: "Farmer", model: "" },
    { agent: "Tannu", status: "Created", customer: "9844272129", source: "Organic", subsource: "Organic - Website-Booking", hub: "REVOLT HUB CHIKODI", booking: "RV26C187656", date: "2026-03-12", profession: "Milk dairy", model: "" },
    { agent: "Bharti", status: "Created", customer: "9765238356", source: "Paid", subsource: "Paid - Meta Form - TestRide", hub: "REVOLT HUB WASHIM", booking: "RV26C187736", date: "2026-03-13", profession: "Tata motor", model: "" },
    { agent: "Geeta", status: "Created", customer: "7568240141", source: "Paid", subsource: "Paid - Meta Form - TestRide", hub: "REVOLT HUB BHILWARA", booking: "RV26C187714", date: "2026-03-13", profession: "Business", model: "" },
    { agent: "Gagan", status: "Cancellation Request", customer: "7359408824", source: "Organic", subsource: "Organic - Website-TestRide", hub: "REVOLT HUB BAPUNAGAR", booking: "RV26C187766", date: "2026-03-13", profession: "", model: "" },
    { agent: "Aman", status: "Created", customer: "7259793656", source: "Paid", subsource: "Paid - Meta Form - TestRide", hub: "REVOLT HUB MANGALURU", booking: "RV26C187770", date: "2026-03-13", profession: "", model: "" },
    { agent: "Tannu", status: "Created", customer: "8870257204", source: "#N/A", subsource: "#N/A", hub: "#N/A", booking: "RV26C187778", date: "2026-03-13", profession: "Job", model: "" },
    { agent: "Geeta", status: "Delivered", customer: "7057904518", source: "Chatbot", subsource: "Chatbot", hub: "REVOLT HUB VADODARA", booking: "RV26C187900", date: "2026-03-14", profession: "PVt Job", model: "" },
    { agent: "Sushmita", status: "Created", customer: "7057378184", source: "Paid", subsource: "Paid - Meta Form - TestRide", hub: "REVOLT HUB SOLAPUR", booking: "RV26C187798", date: "2026-03-14", profession: "PVt Job", model: "" },
    { agent: "Sushmita", status: "Created", customer: "750726299", source: "#N/A", subsource: "#N/A", hub: "#N/A", booking: "RV26C187835", date: "2026-03-14", profession: "PVt Job sevant", model: "" },
    { agent: "Gagan", status: "Cancellation Request", customer: "9869338342", source: "Organic", subsource: "Revolt Enquiry", hub: "REVOLT HUB VIKHROLI", booking: "RV26C187806", date: "2026-03-14", profession: "Govt job", model: "" },
    { agent: "Aman", status: "Cancellation Request", customer: "6261548762", source: "Chatbot", subsource: "Chatbot", hub: "REVOLT HUB KATNI", booking: "RV26C187968", date: "2026-03-16", profession: "JOB", model: "" },
    { agent: "Bharti", status: "Created", customer: "7350259958", source: "Paid", subsource: "Paid - Meta Form - TestRide", hub: "REVOLT HUB HADAPSAR PUNE", booking: "RV26C187975", date: "2026-03-16", profession: "Engineer", model: "" },
    { agent: "Aman", status: "Created", customer: "7003121478", source: "Organic", subsource: "Bike Dekho", hub: "REVOLT HUB BARUIPUR", booking: "RV26C187974", date: "2026-03-16", profession: "wholesale", model: "" },
    { agent: "Tannu", status: "Created", customer: "9504330756", source: "Organic", subsource: "Revolt Enquiry", hub: "REVOLT HUB DEOGHAR", booking: "RV26C188000", date: "2026-03-16", profession: "", model: "" },
    { agent: "Geeta", status: "Delivered", customer: "7294016979", source: "Organic", subsource: "Revolt Enquiry", hub: "REVOLT HUB BETTIAH", booking: "RV26C187961", date: "2026-03-16", profession: "Pvt Job", model: "" },
    { agent: "Aman", status: "Created", customer: "8888340934", source: "Paid", subsource: "Paid - Meta Form - TestRide", hub: "REVOLT HUB AURANGABAD", booking: "RV26C188002", date: "2026-03-16", profession: "Govt", model: "" },
    { agent: "Aman", status: "Created", customer: "8251863391", source: "Organic", subsource: "Revolt Enquiry", hub: "REVOLT HUB SEONI MALWA", booking: "RV26C188017", date: "2026-03-16", profession: "appolo Tyar", model: "" },
    { agent: "Gagan", status: "Created", customer: "9850596096", source: "Paid", subsource: "Paid - Meta Form - TestRide", hub: "REVOLT HUB SANGLI", booking: "RV26C188032", date: "2026-03-16", profession: "business", model: "" },
    { agent: "Geeta", status: "Delivered", customer: "9970905499", source: "Organic", subsource: "Organic - Website-TestRide", hub: "REVOLT HUB HADAPSAR PUNE", booking: "RV26C188060//RV26C188566", date: "2026-03-16", profession: "", model: "" },
    { agent: "Tannu", status: "Cancellation Request", customer: "8541909893", source: "Organic", subsource: "Revolt Enquiry", hub: "REVOLT HUB DARBHANGA", booking: "RV26C188076", date: "2026-03-17", profession: "electricean", model: "" },
    { agent: "Bharti", status: "Delivered", customer: "9791933833", source: "Organic", subsource: "Organic - Website-TestRide", hub: "REVOLT HUB COIMBATORE", booking: "RV26C188084", date: "2026-03-17", profession: "", model: "" },
    { agent: "Bharti", status: "Delivered", customer: "7588505533", source: "#N/A", subsource: "#N/A", hub: "#N/A", booking: "RV26C188165", date: "2026-03-17", profession: "", model: "" },
    { agent: "Gagan", status: "Delivered", customer: "9637774276", source: "Paid", subsource: "Paid - Meta Form - TestRide", hub: "REVOLT HUB CHIKODI", booking: "RV26C188166", date: "2026-03-17", profession: "Business", model: "" },
    { agent: "Geeta", status: "Created", customer: "9759595217", source: "Organic", subsource: "Organic - Website-TestRide", hub: "REVOLT HUB FIROZABAD", booking: "RV26C188186", date: "2026-03-18", profession: "Teacher", model: "" },
    { agent: "Tannu", status: "Delivered", customer: "9993131898", source: "Organic", subsource: "Organic - Website-TestRide", hub: "REVOLT HUB NUAPADA", booking: "RV26C188180", date: "2026-03-18", profession: "Electrician", model: "" },
    { agent: "Geeta", status: "Delivered", customer: "9960507805", source: "Organic", subsource: "Organic - Website-Booking", hub: "REVOLT HUB BUXAR", booking: "RV26C188224", date: "2026-03-18", profession: "Electrician", model: "" },
    { agent: "Gagan", status: "Created", customer: "7991129183", source: "Paid", subsource: "Paid - websitebooknow - Website-Booking", hub: "REVOLT HUB BUXAR", booking: "RV26C188277", date: "2026-03-19", profession: "Job", model: "" },
    { agent: "Bharti", status: "Cancel", customer: "8603865512", source: "Organic", subsource: "Organic - Website-Booking", hub: "REVOLT HUB HAZARIBAG", booking: "RV26C188273", date: "2026-03-19", profession: "Govt Job", model: "" },
    { agent: "Aman", status: "Created", customer: "9926777763", source: "Organic", subsource: "Organic - Website-Booking", hub: "REVOLT HUB INDORE - MR9 ROAD", booking: "RV26C188285", date: "2026-03-19", profession: "Govt Job", model: "" },
    { agent: "Aman", status: "Created", customer: "9255180031", source: "Paid", subsource: "Paid - Meta Form - TestRide", hub: "REVOLT HUB SONIPAT", booking: "RV26C188292", date: "2026-03-19", profession: "", model: "" },
    { agent: "Sushmita", status: "Created", customer: "9001057777", source: "Organic", subsource: "Organic - Website-Booking", hub: "REVOLT HUB BIKANER", booking: "RV26C188307", date: "2026-03-19", profession: "export Business", model: "" },
    { agent: "Geeta", status: "Created", customer: "7000043640", source: "Organic", subsource: "Organic - Website-TestRide", hub: "REVOLT HUB INDORE - MR9 ROAD", booking: "RV26C188466", date: "2026-03-20", profession: "Farmer", model: "" },
    { agent: "Tanu kasera", status: "Created", customer: "9415646455", source: "Organic", subsource: "Organic - Website-TestRide", hub: "REVOLT HUB LUCKNOW", booking: "RV26C188458", date: "2026-03-20", profession: "Business", model: "" },
    { agent: "Gagan", status: "Delivered", customer: "8008530505", source: "Organic", subsource: "Revolt Enquiry", hub: "REVOLT HUB MEDCHAL MALKAJGIRI", booking: "RV26C188513", date: "2026-03-20", profession: "medical Line", model: "" },
    { agent: "Geeta", status: "Created", customer: "9001683477", source: "Organic", subsource: "Organic - Website-Booking", hub: "REVOLT HUB SUMERPUR", booking: "RV26C188580", date: "2026-03-21", profession: "Business", model: "" },
    { agent: "Gagan", status: "Created", customer: "9504043976", source: "Paid", subsource: "Paid - Meta Form - TestRide", hub: "REVOLT HUB PURNIA", booking: "RV26C188568", date: "2026-03-21", profession: "work in development block", model: "" },
    { agent: "Bharti", status: "Delivered", customer: "9050557276", source: "Organic", subsource: "Revolt Enquiry", hub: "REVOLT HUB PALWAL", booking: "RV26C188586", date: "2026-03-21", profession: "Job", model: "" },
    { agent: "Tannu", status: "Delivered", customer: "9725269665", source: "Organic", subsource: "Revolt Enquiry", hub: "REVOLT HUB BAPUNAGAR", booking: "RV26C188599", date: "2026-03-21", profession: "Sr executive In Documention and ops", model: "" },
    { agent: "Bharti", status: "Delivered", customer: "7217389094", source: "Organic", subsource: "Organic - Website-TestRide", hub: "REVOLT HUB GHAZIABAD", booking: "RV26C188614", date: "2026-03-21", profession: "video grapher/editor", model: "" },
    { agent: "Sushmita", status: "Created", customer: "9909092523", source: "Organic", subsource: "Organic - Website-Booking", hub: "REVOLT HUB UDHNA", booking: "RV26C188613", date: "2026-03-21", profession: "business", model: "" },
    { agent: "Aman", status: "Created", customer: "9782612516", source: "Organic", subsource: "CleverTap", hub: "REVOLT HUB CHITTORGARH", booking: "RV26C188715", date: "2026-03-23", profession: "Own", model: "" },
    { agent: "Geeta", status: "Created", customer: "9767600262", source: "Organic", subsource: "Revolt Enquiry", hub: "REVOLT HUB SATARA", booking: "RV26C188726", date: "2026-03-23", profession: "Professor", model: "" },
    { agent: "Aman", status: "Created", customer: "9885323133", source: "Paid", subsource: "Paid - Meta Form - TestRide", hub: "REVOLT HUB MEDCHAL MALKAJGIRI", booking: "RV26C188746", date: "2026-03-23", profession: "pvt job", model: "" },
    { agent: "Geeta", status: "Delivered", customer: "9887265984", source: "Paid", subsource: "Paid - Meta Form - TestRide", hub: "REVOLT HUB JODHPUR", booking: "RV26C188817", date: "2026-03-24", profession: "", model: "" },
    { agent: "Gagan", status: "Delivered", customer: "9785222384", source: "Chatbot", subsource: "Chatbot", hub: "REVOLT HUB HANUMANGARH", booking: "RV26C188843", date: "2026-03-24", profession: "Milk man", model: "" },
    { agent: "Sushmita", status: "Created", customer: "9823374845", source: "#N/A", subsource: "#N/A", hub: "#N/A", booking: "RV26C188891", date: "2026-03-24", profession: "", model: "" },
    { agent: "Geeta", status: "Created", customer: "7352887251", source: "#N/A", subsource: "#N/A", hub: "#N/A", booking: "RV26C188887", date: "2026-03-24", profession: "", model: "" },
    { agent: "Aman", status: "Delivered", customer: "7982244329", source: "Organic", subsource: "Organic - Website-TestRide", hub: "REVOLT HUB KAROL BAGH", booking: "RV26C188904", date: "2026-03-25", profession: "RTPS block job", model: "" },
    { agent: "Aman", status: "Created", customer: "8757356146", source: "Organic", subsource: "91 Wheels", hub: "REVOLT HUB MADHEPURA", booking: "RV26C188899", date: "2026-03-25", profession: "field work medicine supply", model: "" },
    { agent: "Sushmita", status: "Created", customer: "9284889038", source: "Paid", subsource: "Paid - Meta Form - FB Lead Ads - TestRide", hub: "REVOLT HUB SOLAPUR", booking: "RV26C188913", date: "2026-03-25", profession: "Teacher", model: "" },
    { agent: "Geeta", status: "Created", customer: "9534951860", source: "Organic", subsource: "Revolt Enquiry", hub: "REVOLT HUB CHAPRA", booking: "RV26C188963", date: "2026-03-25", profession: "", model: "" },
    { agent: "Gagan", status: "Created", customer: "8639147779", source: "Paid", subsource: "Paid - Google - Website-Booking", hub: "REVOLT HUB HIMAYATHNAGAR", booking: "RV26C188926", date: "2026-03-25", profession: "", model: "" },
    { agent: "Bharti", status: "Created", customer: "8432483029", source: "Paid", subsource: "Paid - Meta Form - TestRide", hub: "REVOLT HUB BEHROR", booking: "RV26C189083", date: "2026-03-26", profession: "civil construction", model: "" },
    { agent: "Bharti", status: "Created", customer: "9096712792", source: "Organic", subsource: "Revolt Enquiry", hub: "REVOLT HUB ANDHERI", booking: "RV26C189057", date: "2026-03-26", profession: "Job", model: "" },
    { agent: "Tannu", status: "Delivered", customer: "8571002124", source: "Organic", subsource: "Revolt Enquiry", hub: "REVOLT HUB AJMER", booking: "RV26C189106", date: "2026-03-26", profession: "Work in Hindustan zinc limited", model: "" },
    { agent: "Gagan", status: "Created", customer: "7979082672", source: "Organic", subsource: "Revolt Enquiry", hub: "REVOLT HUB GAYA", booking: "RV26C189115", date: "2026-03-26", profession: "Job", model: "" },
    { agent: "Sushmita", status: "Created", customer: "9608206169", source: "Organic", subsource: "Organic - Website-Booking", hub: "REVOLT HUB PATNA(ZERO MILE)", booking: "RV26C189142", date: "2026-03-26", profession: "", model: "" },
    { agent: "Aman", status: "Created", customer: "9918471854", source: "Organic", subsource: "Organic - Website-TestRide", hub: "REVOLT HUB LUCKNOW", booking: "RV26C189148", date: "2026-03-26", profession: "", model: "" },
    { agent: "Geeta", status: "Delivered", customer: "9648733156", source: "Organic", subsource: "Organic - Website-TestRide", hub: "REVOLT HUB LUCKNOW", booking: "RV26C189149", date: "2026-03-26", profession: "", model: "" },
    { agent: "Aman", status: "Created", customer: "8964866489", source: "", subsource: "", hub: "", booking: "RV26C189215", date: "2026-03-27", profession: "", model: "" },
    { agent: "Geeta", status: "Created", customer: "6206099919", source: "", subsource: "", hub: "", booking: "RV26C189303", date: "2026-03-27", profession: "", model: "" },
    { agent: "Tannu", status: "Created", customer: "9370761100", source: "", subsource: "", hub: "", booking: "RV26C189269", date: "2026-03-27", profession: "", model: "" },
];

const TaskTracker = () => {
    const [allData] = useState([...SAMPLE_DATA]);
    const [filteredData, setFilteredData] = useState([...SAMPLE_DATA]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [currentSort, setCurrentSort] = useState({ column: 'agent', ascending: true });
    const itemsPerPage = 10;

    // Update metrics on data change
    const getMetrics = () => {
        const total = filteredData.length;
        const delivered = filteredData.filter(d => d.status === 'Delivered').length;
        const created = filteredData.filter(d => d.status === 'Created').length;
        const cancelled = filteredData.filter(d => d.status === 'Cancel' || d.status === 'Cancellation Request').length;

        return { total, delivered, created, cancelled };
    };

    // Filter data when search or status changes
    useEffect(() => {
        const filtered = allData.filter(item => {
            const matchSearch = !searchTerm || 
                item.agent.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.hub.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.profession.toLowerCase().includes(searchTerm.toLowerCase());
            
            const matchStatus = !statusFilter || item.status === statusFilter;

            return matchSearch && matchStatus;
        });

        setFilteredData(filtered);
        setCurrentPage(1);
    }, [searchTerm, statusFilter, allData]);

    // Sort data
    const handleSort = (column) => {
        let ascending = true;
        if (currentSort.column === column) {
            ascending = !currentSort.ascending;
        }

        const sorted = [...filteredData].sort((a, b) => {
            let aVal = a[column] || '';
            let bVal = b[column] || '';

            if (typeof aVal === 'string') {
                aVal = aVal.toLowerCase();
                bVal = bVal.toLowerCase();
            }

            if (aVal < bVal) return ascending ? -1 : 1;
            if (aVal > bVal) return ascending ? 1 : -1;
            return 0;
        });

        setFilteredData(sorted);
        setCurrentSort({ column, ascending });
    };

    // Export to CSV
    const exportData = () => {
        let csv = 'Agent Name,Status,Customer #,Source,Sub Source,HUB,Booking ID,Date,Profession,Model\n';
        
        filteredData.forEach(row => {
            csv += `"${row.agent}","${row.status}","${row.customer}","${row.source}","${row.subsource}","${row.hub}","${row.booking}","${row.date}","${row.profession}","${row.model}"\n`;
        });

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tracker_data.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    // Reset filters
    const resetFilters = () => {
        setSearchTerm('');
        setStatusFilter('');
    };

    // Pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const metrics = getMetrics();

    return (
        <div className="dashboard">
            {/* Header */}
            <div className="dashboard-header">
                <div className="header-content">
                    <h1>🏍️ Revolt Bikes Tracker</h1>
                    <p>Professional Lead Management & Booking Tracking System</p>
                </div>
                <div className="header-date">
                    <span>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
            </div>

            {/* Metrics Cards */}
            <div className="metrics-container">
                <div className="metric-card">
                    <div className="metric-icon">📊</div>
                    <div className="metric-info">
                        <h3>Total Leads</h3>
                        <p className="metric-value">{metrics.total}</p>
                    </div>
                </div>
                <div className="metric-card">
                    <div className="metric-icon">✅</div>
                    <div className="metric-info">
                        <h3>Delivered</h3>
                        <p className="metric-value completed">{metrics.delivered}</p>
                    </div>
                </div>
                <div className="metric-card">
                    <div className="metric-icon">⏳</div>
                    <div className="metric-info">
                        <h3>Created</h3>
                        <p className="metric-value in-progress">{metrics.created}</p>
                    </div>
                </div>
                <div className="metric-card">
                    <div className="metric-icon">❌</div>
                    <div className="metric-info">
                        <h3>Cancelled</h3>
                        <p className="metric-value pending">{metrics.cancelled}</p>
                    </div>
                </div>
            </div>

            {/* Filter Section */}
            <div className="filter-section">
                <div className="search-box">
                    <input 
                        type="text" 
                        placeholder="🔍 Search by agent name, customer, HUB, or profession..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="filter-controls">
                    <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">All Status</option>
                        <option value="Created">Created</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancel">Cancel</option>
                        <option value="Cancellation Request">Cancellation Request</option>
                    </select>

                    <button className="btn-reset" onClick={resetFilters}>Reset Filters</button>
                    <button className="btn-export" onClick={exportData}>📥 Export Data</button>
                </div>
            </div>

            {/* Data Table */}
            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th onClick={() => handleSort('agent')}>Agent Name ⬍</th>
                            <th onClick={() => handleSort('status')}>Status ⬍</th>
                            <th onClick={() => handleSort('customer')}>Customer # ⬍</th>
                            <th onClick={() => handleSort('source')}>Source ⬍</th>
                            <th onClick={() => handleSort('subsource')}>Sub Source ⬍</th>
                            <th onClick={() => handleSort('hub')}>HUB ⬍</th>
                            <th onClick={() => handleSort('booking')}>Booking ID ⬍</th>
                            <th onClick={() => handleSort('date')}>Date ⬍</th>
                            <th onClick={() => handleSort('profession')}>Profession ⬍</th>
                            <th onClick={() => handleSort('model')}>Model ⬍</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((row, idx) => (
                            <tr key={idx}>
                                <td>{row.agent}</td>
                                <td>
                                    <span className={`status-badge ${row.status.toLowerCase().replace(' ', '-')}`}>
                                        {row.status}
                                    </span>
                                </td>
                                <td>{row.customer}</td>
                                <td>{row.source}</td>
                                <td>{row.subsource}</td>
                                <td>{row.hub}</td>
                                <td className="booking-id">{row.booking}</td>
                                <td>{row.date}</td>
                                <td>{row.profession}</td>
                                <td>{row.model}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button 
                        className="btn-pagination" 
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                    >
                        ← Previous
                    </button>
                    <span className="page-info">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button 
                        className="btn-pagination" 
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                    >
                        Next →
                    </button>
                </div>
            )}
        </div>
    );
};

export default TaskTracker;
