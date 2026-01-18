package com.sou.eCom.model.dto;

import com.sou.eCom.model.User;

public record LoginReq(
    String email,
    String password
) {

}
