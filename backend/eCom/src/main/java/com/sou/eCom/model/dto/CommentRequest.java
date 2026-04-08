package com.sou.eCom.model.dto;


public record CommentRequest(
        String desc,
        double rating,
        String imgUrl
) {
}
