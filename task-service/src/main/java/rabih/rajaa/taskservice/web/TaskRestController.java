package rabih.rajaa.taskservice.web;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import rabih.rajaa.taskservice.dto.TaskDTO;
import rabih.rajaa.taskservice.service.TaskService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskRestController {

    @Autowired
    private TaskService taskService;

    @GetMapping
    public ResponseEntity<Page<TaskDTO>> getAllTasks(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            @RequestParam(name = "status", required = false) String status,
            @RequestParam(name = "priority", required = false) String priority,
            @RequestParam(name = "assignedUser", required = false) Long assignedUser,
            @RequestParam(name = "projectId", required = false) Long projectId,
            @RequestParam(name = "search", required = false) String search) {
        Pageable pageable = PageRequest.of(page, size);

        // If no filters are provided, get all tasks
        if (status == null && priority == null && assignedUser == null && projectId == null && search == null) {
            Page<TaskDTO> tasks = taskService.getAllTasks(pageable);
            return ResponseEntity.ok(tasks);
        }

        // Use searchWithFilters for filtered results
        Page<TaskDTO> tasks = taskService.searchWithFilters(
            search, search, status, priority, projectId, assignedUser, pageable);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskDTO> getTaskById(@PathVariable Long id) {
        TaskDTO task = taskService.getById(id);
        return ResponseEntity.ok(task);
    }

    @PostMapping
    public ResponseEntity<TaskDTO> createTask(@RequestBody TaskDTO taskDTO) {
        TaskDTO createdTask = taskService.create(taskDTO);
        return ResponseEntity.ok(createdTask);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskDTO> updateTask(@PathVariable Long id, @RequestBody TaskDTO taskDTO) {
        TaskDTO updatedTask = taskService.update(id, taskDTO);
        return ResponseEntity.ok(updatedTask);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<TaskDTO> updateTaskStatus(@PathVariable Long id, @RequestBody Map<String, String> statusUpdate) {
        // For now, if status is "COMPLETED", mark as completed
        if ("COMPLETED".equals(statusUpdate.get("status"))) {
            TaskDTO updatedTask = taskService.markCompleted(id);
            return ResponseEntity.ok(updatedTask);
        }
        // For other status updates, we would need to implement update method
        TaskDTO task = taskService.getById(id);
        // Update status logic would go here
        return ResponseEntity.ok(task);
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<Page<TaskDTO>> getTasksByProject(
            @PathVariable Long projectId,
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<TaskDTO> tasks = taskService.getByProject(projectId, pageable);
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getTaskStats() {
        // This would need to be implemented in the service
        // For now, return basic stats
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalTasks", 0);
        stats.put("completedTasks", 0);
        stats.put("pendingTasks", 0);
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/my-tasks")
    public ResponseEntity<Page<TaskDTO>> getMyTasks(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size) {
        // This would need user authentication context
        // For now, return all tasks
        Pageable pageable = PageRequest.of(page, size);
        Page<TaskDTO> tasks = taskService.getAllTasks(pageable);
        return ResponseEntity.ok(tasks);
    }

    @PostMapping("/{id}/assign/{userId}")
    public ResponseEntity<TaskDTO> assignUserToTask(@PathVariable Long id, @PathVariable Long userId) {
        // This would need to be implemented in the service
        // For now, just return the task
        TaskDTO task = taskService.getById(id);
        return ResponseEntity.ok(task);
    }

    @DeleteMapping("/{id}/assign/{userId}")
    public ResponseEntity<TaskDTO> removeUserFromTask(@PathVariable Long id, @PathVariable Long userId) {
        // This would need to be implemented in the service
        // For now, just return the task
        TaskDTO task = taskService.getById(id);
        return ResponseEntity.ok(task);
    }
}
