package rabih.rajaa.projectservice.web;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;

import rabih.rajaa.projectservice.dto.ProjectDTO;
import rabih.rajaa.projectservice.service.ProjectServicee;

@Controller
public class ProjectGraphQLController {

    private final ProjectServicee service;

    public ProjectGraphQLController(ProjectServicee service) {
        this.service = service;
    }

    @MutationMapping
    public ProjectDTO createProject(@Argument String title, @Argument String description) {
        ProjectDTO dto = new ProjectDTO();
        dto.setTitle(title);
        dto.setDescription(description);
        return service.create(dto);
    }

    @MutationMapping
    public ProjectDTO updateProject(@Argument Long id, @Argument String title, @Argument String description) {
        ProjectDTO dto = new ProjectDTO();
        dto.setTitle(title);
        dto.setDescription(description);
        return service.update(id, dto);
    }

    @MutationMapping
    public Boolean deleteProject(@Argument Long id) {
        service.delete(id);
        return true;
    }

    @QueryMapping
    public Page<ProjectDTO> projects(@Argument int page, @Argument int size, @Argument String title, @Argument String description, @Argument String status, @Argument String priority) {
        if (title != null || description != null || status != null || priority != null) {
            return service.search(title, description, status, priority, PageRequest.of(page, size));
        } else {
            return service.getAll(PageRequest.of(page, size));
        }
    }

    @QueryMapping
    public ProjectDTO projectById(@Argument Long id) {
        return service.getById(id);
    }
}
