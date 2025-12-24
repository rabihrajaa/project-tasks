package rabih.rajaa.taskservice.service.implementation;

import jakarta.persistence.criteria.Predicate;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import rabih.rajaa.taskservice.dto.TaskDTO;
import rabih.rajaa.taskservice.entity.Task;
import rabih.rajaa.taskservice.mapper.TaskMapper;
import rabih.rajaa.taskservice.repository.TaskRepository;
import rabih.rajaa.taskservice.service.TaskService;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class TaskServiceImpl implements TaskService {

    private final TaskRepository repository;
    private final TaskMapper mapper;

    public TaskServiceImpl(TaskRepository repository, TaskMapper mapper) {
        this.repository = repository;
        this.mapper = mapper;
    }

    @Override
    public TaskDTO create(TaskDTO dto) {
        Task task = mapper.toEntity(dto);
        task.setCreatedAt(LocalDateTime.now());
        task.setUpdatedAt(LocalDateTime.now());
        return mapper.toDTO(repository.save(task));
    }

    @Override
    public Page<TaskDTO> getAllTasks(Pageable pageable) {
        return repository.findAll(pageable)
                .map(mapper::toDTO);
    }

    @Override
    public Page<TaskDTO> getByProject(Long projectId, Pageable pageable) {
        return repository.findByProjectId(projectId, pageable)
                .map(mapper::toDTO);
    }

    @Override
    public TaskDTO markCompleted(Long id) {
        Task task = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        task.setCompleted(true);
        task.setUpdatedAt(LocalDateTime.now());
        return mapper.toDTO(repository.save(task));
    }

    @Override
    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Task not found");
        }
        repository.deleteById(id);
    }

    @Override
    public TaskDTO getById(Long id) {
        return repository.findById(id)
                .map(mapper::toDTO)
                .orElseThrow(() -> new RuntimeException("Task not found"));
    }

    @Override
    public TaskDTO update(Long id, TaskDTO dto) {
        Task existingTask = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        mapper.updateEntity(dto, existingTask);
        existingTask.setUpdatedAt(LocalDateTime.now());
        return mapper.toDTO(repository.save(existingTask));
    }

    @Override
    public Page<TaskDTO> search(String title, String description, Pageable pageable) {
        return repository.findByTitleContainingOrDescriptionContaining(title, description, pageable)
                .map(mapper::toDTO);
    }

    @Override
    public Page<TaskDTO> searchWithFilters(String title, String description, String status, String priority, Long projectId, Long assignedUserId, Pageable pageable) {
        return repository.findWithFilters(title, description, status, priority, projectId, assignedUserId, pageable)
                .map(mapper::toDTO);
    }
}
