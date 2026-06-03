package com.SGPPiedrazul.acceptance;

import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Component;
import org.springframework.test.web.servlet.MvcResult;

@Component
@Scope("cucumber-glue")
public class ScenarioContext {
    public MvcResult lastResult;
    public Long profesionalId;
    public Long pacienteId;
    public Long citaId;
}
