package rabih.rajaa.taskservice.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import rabih.rajaa.taskservice.dto.TaskDTO;

public interface TaskService {
    TaskDTO create(TaskDTO dto);
    Page<TaskDTO> getAllTasks(Pageable pageable);
    Page<TaskDTO> getByProject(Long projectId, Pageable pageable);
    TaskDTO markCompleted(Long id);
    void delete(Long id);
    TaskDTO getById(Long id);
    TaskDTO update(Long id, TaskDTO dto);
    Page<TaskDTO> search(String title, String description, Pageable pageable);
    Page<TaskDTO> searchWithFilters(String title, String description, String status, String priority, Long projectId, Long assignedUserId, Pageable pageable);
}
