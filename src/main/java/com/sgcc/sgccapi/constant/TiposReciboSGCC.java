package com.sgcc.sgccapi.constant;

public enum TiposReciboSGCC {
    LUZ("LUZ"),
    AGUA("AGUA"),
    GAS("GAS");

    private final String tipoRecibo;

    TiposReciboSGCC(String tRecibo) {
        this.tipoRecibo = tRecibo;
    }

    public String getTipoRecibo() {
        return tipoRecibo;
    }
}
