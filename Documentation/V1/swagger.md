# SWAGGER
**2024/11/13**

In this update, I separated the interaction between **Swagger** and the **routes**, as it could become cumbersome in the long term. For this purpose, I created a swagger folder within the **app** directory, designed to store the entities that **Swagger** will use for HTTP **methods**. In this entity, I also included a function that defines the required fields for the user entity, which I am using as an example.

This entity uses a repository named EntitySwaggerRepository, located in the *src/core/swagger* path. This repository will serve as the standard for **GET, POST, PUT, PATCH, and DELETE (del)** methods, as well as for defining the required fields and parameters for each operation.