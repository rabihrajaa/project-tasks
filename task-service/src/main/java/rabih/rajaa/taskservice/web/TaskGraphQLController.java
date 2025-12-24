package rabih.rajaa.taskservice.web;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.graphql.data.method.annotation.Argument;
import org.springframework.graphql.data.method.annotation.MutationMapping;
import org.springframework.graphql.data.method.annotation.QueryMapping;
import org.springframework.stereotype.Controller;
import rabih.rajaa.taskservice.dto.TaskDTO;
import rabih.rajaa.taskservice.service.TaskService;

import java.time.LocalDate;

@Controller
public class TaskGraphQLController {

    private final TaskService taskService;

    public TaskGraphQLController(TaskService taskService) {
        this.taskService = taskService;
    }

    // -------------------------------
    // MUTATIONS
    // -------------------------------

    @MutationMapping
    public TaskDTO createTask(
            @Argument Long projectId,
            @Argument String title,
            @Argument String description,
            @Argument String dueDate
    ) {
        TaskDTO dto = new TaskDTO();
        dto.setProjectId(projectId);
        dto.setTitle(title);
        dto.setDescription(description);
        dto.setDueDate(LocalDate.parse(dueDate));
        dto.setCompleted(false);

        return taskService.create(dto);
    }

    @MutationMapping
    public TaskDTO completeTask(@Argument Long taskId) {
        return taskService.markCompleted(taskId);
    }

    @MutationMapping
    public Boolean deleteTask(@Argument Long taskId) {
        taskService.delete(taskId);
        return true;
    }

    // -------------------------------
    // QUERIES
    // -------------------------------

    @QueryMapping
    public Page<TaskDTO> tasksByProject(
            @Argument Long projectId,
            @Argument int page,
            @Argument int size
    ) {
        return taskService.getByProject(
                projectId,
                PageRequest.of(page, size)
        );
    }

    @MutationMapping
    public TaskDTO updateTask(
            @Argument Long id,
            @Argument String title,
            @Argument String description,
            @Argument String dueDate
    ) {
        TaskDTO dto = new TaskDTO();
        dto.setTitle(title);
        dto.setDescription(description);
        dto.setDueDate(LocalDate.parse(dueDate));
        return taskService.update(id, dto);
    }

    @QueryMapping
    public TaskDTO taskById(@Argument Long id) {
        return taskService.getById(id);
    }

    @QueryMapping
    public Page<TaskDTO> searchTasks(
            @Argument String title,
            @Argument String description,
            @Argument int page,
            @Argument int size
    ) {
        return taskService.search(title, description, PageRequest.of(page, size));
    }
}
