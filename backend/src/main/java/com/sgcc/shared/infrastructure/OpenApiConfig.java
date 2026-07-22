package com.sgcc.shared.infrastructure;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.License;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("SGCC API")
                        .description("Sistema de Gestión de Cobros y Consumos de Recibos")
                        .version("1.0.0")
                        .contact(new Contact()
                                .name("SGCC Team")
                                .email("admin@sgcc.com"))
                        .license(new License()
                                .name("Cloud Lab v1.0")));
    }
}
