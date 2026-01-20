package com.sou.eCom.model.dto;


public record CommentRequest(
        long userId,
        String desc,
        double rating,
        String imgUrl
) {
}
