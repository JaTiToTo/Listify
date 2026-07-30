package com.jatitoto.listify_backend.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.doReturn;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

class UtilServiceTest {

    @AfterEach
    void clearContext() {
        RequestContextHolder.resetRequestAttributes();
    }

    @Nested
    class GetCurrentSession {

        @Test
        void createsSessionWhenMissing() {
            HttpServletRequest request = org.mockito.Mockito.mock(HttpServletRequest.class);
            HttpSession session = org.mockito.Mockito.mock(HttpSession.class);

            doReturn(session).when(request).getSession(true);
            doReturn(null).when(request).getSession(false);
            RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(request, new MockHttpServletResponse()));

            HttpSession actual = UtilService.getCurrentSession();

            assertThat(actual).isSameAs(session);
        }

        @Test
        void returnsExistingSessionWhenRequestedWithoutCreation() {
            HttpServletRequest request = org.mockito.Mockito.mock(HttpServletRequest.class);
            HttpSession session = org.mockito.Mockito.mock(HttpSession.class);

            doReturn(session).when(request).getSession(false);
            RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(request, new MockHttpServletResponse()));

            HttpSession actual = UtilService.getCurrentSession(false);

            assertThat(actual).isSameAs(session);
        }

        @Test
        void failsWithoutRequestContext() {
            RequestContextHolder.resetRequestAttributes();

            assertThatThrownBy(UtilService::getCurrentSession)
                .isInstanceOf(IllegalStateException.class)
                .hasMessage("No request context available");
        }
    }
}