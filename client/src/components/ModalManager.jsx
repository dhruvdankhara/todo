import TodoModal from "./TodoModal";
import FileUploadModal from "./FileUploadModal";
import LinkModal from "./LinkModal";
import ModernTodoDetailModal from "./ModernTodoDetailModal";
import PropTypes from "prop-types";

const ModalManager = ({
  showTodoModal,
  showFileModal,
  showLinkModal,
  showDetailModal,
  editingTodo,
  selectedTodo,
  onCloseTodoModal,
  onCloseFileModal,
  onCloseLinkModal,
  onCloseDetailModal,
}) => {
  return (
    <>
      <TodoModal
        isOpen={showTodoModal}
        onClose={onCloseTodoModal}
        todo={editingTodo}
      />

      <FileUploadModal
        isOpen={showFileModal}
        onClose={onCloseFileModal}
        todo={selectedTodo}
      />

      <LinkModal
        isOpen={showLinkModal}
        onClose={onCloseLinkModal}
        todo={selectedTodo}
      />

      <ModernTodoDetailModal
        isOpen={showDetailModal}
        onClose={onCloseDetailModal}
        todo={selectedTodo}
      />
    </>
  );
};

ModalManager.propTypes = {
  showTodoModal: PropTypes.bool.isRequired,
  showFileModal: PropTypes.bool.isRequired,
  showLinkModal: PropTypes.bool.isRequired,
  showDetailModal: PropTypes.bool.isRequired,
  editingTodo: PropTypes.object,
  selectedTodo: PropTypes.object,
  onCloseTodoModal: PropTypes.func.isRequired,
  onCloseFileModal: PropTypes.func.isRequired,
  onCloseLinkModal: PropTypes.func.isRequired,
  onCloseDetailModal: PropTypes.func.isRequired,
};

ModalManager.defaultProps = {
  editingTodo: null,
  selectedTodo: null,
};

export default ModalManager;
