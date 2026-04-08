package com.sou.eCom.model.dto;

public record ResetReq(
        String token,
        String pwd,
        String email
) {
}
