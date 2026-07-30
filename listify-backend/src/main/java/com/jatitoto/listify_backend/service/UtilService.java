package com.jatitoto.listify_backend.service;

import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

public class UtilService {
    public static HttpSession getCurrentSession() {
        return getCurrentSession(true);
    }

    public static HttpSession getCurrentSession(boolean createIfMissing) {
        ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
        if (attributes == null) {
            throw new IllegalStateException("No request context available");
        }

        HttpServletRequest request = attributes.getRequest();
        return createIfMissing ? request.getSession(true) : request.getSession(false);
    }
}
