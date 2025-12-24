package rabih.rajaa.projectservice.web;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import rabih.rajaa.projectservice.dto.ProjectDTO;
import rabih.rajaa.projectservice.service.ProjectServicee;

@RestController
@RequestMapping("/api/projects")
public class ProjectRestController {

    private final ProjectServicee service;

    public ProjectRestController(ProjectServicee service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<Page<ProjectDTO>> getProjects(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Page<ProjectDTO> projects = service.getAll(PageRequest.of(page, size));
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProjectDTO> getProjectById(@PathVariable Long id) {
        ProjectDTO project = service.getById(id);
        return ResponseEntity.ok(project);
    }

    @PostMapping
    public ResponseEntity<ProjectDTO> createProject(@RequestBody ProjectDTO projectDTO) {
        ProjectDTO created = service.create(projectDTO);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProjectDTO> updateProject(@PathVariable Long id, @RequestBody ProjectDTO projectDTO) {
        ProjectDTO updated = service.update(id, projectDTO);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
