package com.sgcc.sgccapi.config.docs;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.media.ArraySchema;
import io.swagger.v3.oas.models.media.ObjectSchema;
import io.swagger.v3.oas.models.media.StringSchema;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
@OpenAPIDefinition
public class SwaggerDocsConfig {

    @Value("${custom.server.local.url}")
    private String localServerURL;
    @Value("${custom.server.prod.url}")
    private String prodServerURL;

    @Bean
    public OpenAPI customOpenAPI(@Value("${springdoc.version}") String appVersion) {
        var responseEntityListSchema = new ObjectSchema()
                .name("ResponseEntityListSchema")
                .title("ResponseEntityListSchema")
                .description("Response entity list schema")
                .addProperty("message", new StringSchema().example("Ok"))
                .addProperty("details", new ArraySchema());
        var responseEntityObjectSchema = new ObjectSchema()
                .name("ResponseEntityObjectSchema")
                .title("ResponseEntityObjectSchema")
                .description("Response entity object schema")
                .addProperty("message", new StringSchema().example("Ok"))
                .addProperty("details", new ObjectSchema());
        var responseEntityErrorSchema = new ObjectSchema()
                .name("ResponseEntityErrorSchema")
                .title("ResponseEntityErrorSchema")
                .description("Response entity error schema")
                .addProperty("message", new StringSchema().example("There was an error"))
                .addProperty("details", new ArraySchema().example(List.of()));
        return new OpenAPI()
                .components(new Components()
                        .addSchemas("responseEntityListSchema", responseEntityListSchema)
                        .addSchemas("responseEntityObjectSchema", responseEntityObjectSchema)
                        .addSchemas("responseEntityErrorSchema", responseEntityErrorSchema))
                .addServersItem(new Server().url(localServerURL).description("Localhost server"))
                .addServersItem(new Server().url(prodServerURL).description("Production server"))
                .info(new Info().title("SGCC API")
                        .description("This is a sample invoice management API REST, for practice purposes.")
                        .version(appVersion)
                        .license(new License().name("Apache 2.0").url("http://springdoc.org")));
    }
}
