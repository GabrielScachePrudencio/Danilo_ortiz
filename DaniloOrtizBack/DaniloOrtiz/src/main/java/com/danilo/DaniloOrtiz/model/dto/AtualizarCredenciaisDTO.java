package com.danilo.DaniloOrtiz.model.dto;

import lombok.Data;

@Data
public class AtualizarCredenciaisDTO {
    private String mpaccesstoken;
    private String mppublickey;
    private String mpclientid;
    private String mpclientsecret;
    private String mpaccesstokentest;
    private String mppublickeytest;
    private String mpambiente;
}
