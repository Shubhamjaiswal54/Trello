import mongoose from "mongoose";
import organizationModel from "../models/organizationModel.js";

const addorganization = async (req, res) => {
  try {
    const { name } = req.body;
    const organization = await organizationModel.create({
      name: name,
      owner: req.userId,
      members: [req.userId],
    });

    res.status(201).json({
      message: "Organization created successfully",
      organization,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const removeOrganization = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const organization =
      await organizationModel.findByIdAndDelete(organizationId);

    res.status(200).json({
      message: "deleted the org",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
const getorganization = async (req, res) => {
  try {
    const organization = await organizationModel.find();
    res.send(organization);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const addmember = async (req, res) => {
  try {
    const { orgId } = req.params;
    const { memberId } = req.body;

    const organization = await organizationModel.findById(orgId);
    if (!organization) {
      return res.status(404).json({
        message: "Organization not found",
      });
    }

    const memberExists = organization.members.includes(memberId);
    if (memberExists) {
      return res.status(400).json({
        message: "Member already there",
      });
    }

    organization.members.push(memberId);
    await organization.save();
    res.status(200).json({
      message: "Member added successfully",
      organization,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const removeMember = async (req, res) => {
  try {
    const { organizationId } = req.params;
    const { memberId } = req.body;
    const organization = await organizationModel.findById(organizationId);
    organization.members = organization.members.filter(
      (item) => item.id != memberId,
    );
    await organization.save();

    res.status(200).json({
      message: "Member added successfully",
      organization,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export {
  addmember,
  removeMember,
  addorganization,
  removeOrganization,
  getorganization,
};
