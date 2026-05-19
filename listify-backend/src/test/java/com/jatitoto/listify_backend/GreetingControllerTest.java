package com.jatitoto.listify_backend;

import com.jatitoto.listify.model.GreetingResponse;
import com.jatitoto.listify_backend.service.GreetingService;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.doReturn;

@ExtendWith(MockitoExtension.class)
class GreetingServiceTest {

    @Spy
    @InjectMocks
    private GreetingService underTest;

    @Test
    void buildGreetingReturnsCorrectMessage() {
        GreetingResponse response = new GreetingResponse();
        response.setMessage("Hello, Alice!");

        doReturn(response).when(underTest).buildGreeting("Alice");

        assertThat(underTest.buildGreeting("Alice").getMessage())
                .isEqualTo("Hello, Alice!");
    }
}