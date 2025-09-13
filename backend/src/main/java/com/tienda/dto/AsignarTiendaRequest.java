package com.tienda.dto;

public class AsignarTiendaRequest {
    private String email;
    private long tiendaId;
    

    public String getemail() {
        return email;
    }

    public void setemail(String email) {
        this.email = email;
    }

    public long gettiendaId() {
        return tiendaId;
    }

    public void settiendaId(long tiendaId) {
        this.tiendaId = tiendaId;
    }
}
