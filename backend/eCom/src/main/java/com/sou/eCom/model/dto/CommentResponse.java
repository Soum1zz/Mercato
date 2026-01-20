package com.sou.eCom.model.dto;

import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

public record CommentResponse(
        long commentId,
        LocalDate creationDate,
        String desc,
        double rating,

        long userId,
        String userName
) {
}
