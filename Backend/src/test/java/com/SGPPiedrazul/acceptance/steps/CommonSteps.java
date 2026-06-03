package com.SGPPiedrazul.acceptance.steps;

import com.SGPPiedrazul.acceptance.ScenarioContext;
import io.cucumber.java.es.Entonces;
import io.cucumber.java.es.Y;
import org.springframework.beans.factory.annotation.Autowired;

import static org.assertj.core.api.Assertions.assertThat;

public class CommonSteps {

    @Autowired
    private ScenarioContext ctx;

    @Entonces("el sistema responde con código {int}")
    public void sistemaRespondeConCodigo(int expectedStatus) {
        assertThat(ctx.lastResult.getResponse().getStatus())
                .as("HTTP status")
                .isEqualTo(expectedStatus);
    }

    @Y("el cuerpo contiene el documento {string}")
    public void cuerpoContieneDocumento(String documento) throws Exception {
        String body = ctx.lastResult.getResponse().getContentAsString();
        assertThat(body).contains(documento);
    }
}
