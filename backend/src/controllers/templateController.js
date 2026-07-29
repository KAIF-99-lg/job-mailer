const templateService = require('../services/templateService');
const asyncHandler = require('../utils/asyncHandler');
const { sendSuccess } = require('../utils/apiResponse');

const getAllTemplates = asyncHandler(async (req, res) => {
  const templates = await templateService.getAllForSingleUser();
  sendSuccess(res, 200, 'Templates fetched.', { templates });
});

const getTemplateById = asyncHandler(async (req, res) => {
  const template = await templateService.getById(req.params.id);
  sendSuccess(res, 200, 'Template fetched.', { template });
});

const createTemplate = asyncHandler(async (req, res) => {
  const template = await templateService.create(req.body);
  sendSuccess(res, 201, 'Template created successfully.', { template });
});

const updateTemplate = asyncHandler(async (req, res) => {
  const template = await templateService.update(req.params.id, req.body);
  sendSuccess(res, 200, 'Template updated successfully.', { template });
});

const deleteTemplate = asyncHandler(async (req, res) => {
  await templateService.delete(req.params.id);
  sendSuccess(res, 200, 'Template deleted successfully.');
});

module.exports = { getAllTemplates, getTemplateById, createTemplate, updateTemplate, deleteTemplate };
